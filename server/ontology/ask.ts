// ================================================================
// M3 双 Agent 编排：查询规划 Agent + 校验 Agent + 带依据回答（寰宇域）
//
// 与契约仓库 orchestration.py（canonical 模板）对齐的 TS 落地：
//   规划：语义注册表（viewRegistry，无任何物理列名）注入 prompt（铁律①）
//         → 真 LLM 输出 JSON 计划；解析失败重试 1 次 → rulePlan bigram 兜底
//   校验（独立于生成，规则优先于 LLM，铁律③）：
//     SC-V001 域边界：毛利率类问题 → 治理解释（盲盒毛利率物理层缺 cost 依赖
//             被 blocked 的治理活案例，给出可解释拒答 + 替代视图建议）
//     SC-V002 视图合法性：臆造 view_id 拦截（契约 validate_plan 的 TS 镜像）
//   执行：materialize（:name → $n）→ PG 实跑（machine_check 已在 codegen 期机判）
//   回答：口径 + 结果 + SQL 依据 → 真 LLM 作答（铁律②，数字只从结果引用）
//
// 供型：强制真 LLM（DeepSeek）。无 key 抛 AskConfigError → 路由转 503；
// 规则兜底只是解析鲁棒性手段，LLM 网络失败直接上抛，不做 Mock 演示降级。
// ================================================================
import { semanticViews as offeringViews } from './semantic-views.offering.generated';
import { semanticViews as orderViews } from './semantic-views.order.generated';
import { DeepSeekLLM, type ChatMessage, type LLMProvider } from '../agent/llm';
import { pool } from '../db/client';

// ---------------- 类型 ----------------

export interface SemanticPlan {
  view_id: string | null;
  intent: string;
  filters: Record<string, unknown>;
  reasoning: string;
}

export interface Violation {
  rule_id: string;
  severity: 'block' | 'warn';
  message: string;
}

export interface ViewResult {
  columns: string[];
  rows: unknown[];
  rowCount: number;
  sql: string;
  params: Record<string, unknown>;
}

export interface AskResult {
  question: string;
  reply: string;
  stage: 'answered' | 'blocked' | 'no_view';
  plan: SemanticPlan | null;
  planner: string | null;
  validation: { passed: boolean; violations: Violation[] };
  view: string | null;
  data: { columns: string[]; rows: unknown[]; rowCount: number } | null;
  sql: string | null;
  params: Record<string, unknown> | null;
  provider_used: string;
}

export class AskConfigError extends Error {}

export interface AskOptions {
  /** 测试注入用：不传则走 DeepSeekLLM（强制真 LLM） */
  llm?: LLMProvider;
  /** 测试注入用：视图执行桩；不传则 materialize + pool.query 实跑 PG */
  executeView?: (viewId: string, filters: Record<string, unknown>) => Promise<ViewResult>;
}

// ---------------- 语义注册表（纯语义，供 prompt 注入；对齐 Python semantic_registry） ----------------

interface RegistryEntry {
  id: string;
  name_zh: string;
  formula: string;
  grain: string[];
  time_window: unknown;
  notes: string;
}

export const REGISTRY: RegistryEntry[] = [...offeringViews, ...orderViews].map((v) => ({
  id: v.id,
  name_zh: v.nameZh,
  formula: v.formula,
  grain: v.grain,
  time_window: v.timeWindow,
  notes: v.notes,
}));

/** blocked 视图治理台账：编译器不产出（注册表不可见），校验 Agent 据此给可解释拒答 */
const BLOCKED_VIEWS: Record<string, { name_zh: string; reason: string }> = {
  'huanyu.view.mystery_gross_margin': {
    name_zh: '盲盒毛利率',
    reason: '物理层缺逐单成本（cost）依赖，口径未通过治理评审（huanyu-offering.yaml 治理活案例）',
  },
};

const PROVIDER_USED = 'openai_compatible(deepseek)';

// ---------------- 规划 Agent prompt（canonical：契约仓库 orchestration.py） ----------------

const PLANNER_SYSTEM = `你是「查询规划 Agent」。把用户的自然语言问题映射到语义视图注册表中的唯一视图，输出查询计划 JSON。

【语义视图注册表】（口径唯一真相源；每条含 名称/公式/粒度/时间窗/备注，不含任何物理表结构）
{registry}

【规则】
1. view_id 只能取自注册表中的 id；没有视图能回答时输出 null，禁止臆造。
2. filters 仅当问题明确提到注册表中可作为过滤维度的取值时才填，否则输出 {}。
3. intent 必须从以下枚举中选择：metric_query、diagnosis_request、prescription_request、out_of_scope。
4. reasoning 用一句话说明命中依据，必须引用该视图的口径或粒度。
5. 只输出一个 JSON 对象，不要输出任何其他文字：
{"view_id": "…或null", "intent": "…", "filters": {}, "reasoning": "…"}`;

function plannerMessages(question: string): ChatMessage[] {
  const registry = JSON.stringify(REGISTRY, null, 2);
  return [
    { role: 'system', content: PLANNER_SYSTEM.replace('{registry}', registry) },
    { role: 'user', content: question },
  ];
}

const ANSWER_SYSTEM = `你是数据分析助手，基于给定的查询结果回答用户问题。

【回答规则】
1. 数字只能来自【查询结果】，禁止编造、外推或凭记忆补充。
2. 回答必须点明口径：引用视图的指标公式与时间窗，让听者知道数字怎么算出来的。
3. 结果为空时如实说明「没有符合口径的数据」，不得臆测原因。
4. 不回答查询结果与口径之外的问题（如诊断、预测、建议）。
5. 用中文简洁作答，先给结论再给依据。`;

// ---------------- 计划解析（<json> 标签 / ```json 围栏 / 裸 JSON 三态兼容） ----------------

export class PlanParseError extends Error {}

function extractJson(raw: string): string | null {
  const tagged = raw.match(/<json>\s*(\{[\s\S]*?\})\s*<\/json>/i);
  if (tagged) return tagged[1];
  const fenced = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (fenced) return fenced[1];
  const bare = raw.match(/\{[\s\S]*\}/);
  return bare ? bare[0] : null;
}

export function parsePlan(raw: string): SemanticPlan {
  const jsonStr = extractJson((raw || '').trim());
  if (!jsonStr) throw new PlanParseError('输出中未找到 JSON 对象');
  let data: any;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new PlanParseError(`JSON 解析失败: ${(e as Error).message}`);
  }
  if (typeof data !== 'object' || data === null) throw new PlanParseError('计划不是 JSON 对象');
  const viewId = data.view_id == null ? null : String(data.view_id).trim() || null;
  const filters = typeof data.filters === 'object' && data.filters !== null ? data.filters : {};
  return {
    view_id: viewId,
    intent: String(data.intent || 'metric_query'),
    filters,
    reasoning: String(data.reasoning || ''),
  };
}

// ---------------- 规则兜底（仅解析失败时用；中文 bigram 重叠打分） ----------------

function bigrams(text: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length - 1; i++) out.push(text.slice(i, i + 2));
  return out.length ? out : text ? [text] : [];
}

export function rulePlan(question: string): SemanticPlan | null {
  const q = (question || '').trim();
  if (!q) return null;
  let best: { score: number; entry: RegistryEntry; hits: string[] } | null = null;
  for (const entry of REGISTRY) {
    let score = 0;
    const hits: string[] = [];
    for (const bg of new Set(bigrams(entry.name_zh))) {
      if (q.includes(bg)) { score += 3; hits.push(bg); }
    }
    for (const bg of new Set(bigrams(entry.notes || ''))) {
      if (q.includes(bg)) score += 1;
    }
    const latin = entry.formula.match(/[a-z_]{3,}/g) || [];
    for (const token of latin) {
      if (q.toLowerCase().includes(token)) { score += 1; hits.push(token); }
    }
    if (score > 0 && (!best || score > best.score)) best = { score, entry, hits };
  }
  if (!best) return null;
  return {
    view_id: best.entry.id,
    intent: 'metric_query',
    filters: {},
    reasoning: `规则兜底命中「${best.entry.name_zh}」（关键词：${[...new Set(best.hits)].slice(0, 4).join('、')}）`,
  };
}

// ---------------- 校验 Agent（独立于生成；规则优先于 LLM） ----------------

const MARGIN_KEYWORDS = ['毛利率', '毛利', '成本', '利润'];

export function validateQuestion(question: string): Violation[] {
  const hits = MARGIN_KEYWORDS.filter((kw) => question.includes(kw));
  if (!hits.length) return [];
  return [{
    rule_id: 'SC-V001',
    severity: 'block',
    message: (
      `问题涉及「${hits.join('、')}」：盲盒毛利率视图处于 blocked 状态（${BLOCKED_VIEWS['huanyu.view.mystery_gross_margin'].reason}），` +
      '不可查询。可改问已发布的「盲盒销售占比」（huanyu.view.mystery_sales_share）观察卖法结构。'
    ),
  }];
}

export function validatePlan(plan: SemanticPlan): Violation[] {
  if (!plan.view_id) return [];
  if (REGISTRY.some((v) => v.id === plan.view_id)) return [];
  const blocked = BLOCKED_VIEWS[plan.view_id];
  return [{
    rule_id: 'SC-V002',
    severity: 'block',
    message: blocked
      ? `视图 ${plan.view_id}（${blocked.name_zh}）处于 blocked 状态，不可查询：${blocked.reason}`
      : `view_id 不在语义注册表中（疑似臆造）: ${plan.view_id}`,
  }];
}

// ---------------- 执行 + 回答 ----------------

async function defaultExecuteView(viewId: string, filters: Record<string, unknown>): Promise<ViewResult> {
  const view = [...offeringViews, ...orderViews].find((v) => v.id === viewId);
  if (!view) throw new Error(`未注册视图: ${viewId}`);
  const values: unknown[] = [];
  const text = view.sql.replace(/:(\w+)/g, (m, name: string) => {
    if (!(name in filters)) return m;
    values.push(filters[name]);
    return `$${values.length}`;
  });
  const r = await pool.query(text, values);
  return {
    columns: r.fields.map((f: any) => f.name),
    rows: r.rows,
    rowCount: r.rowCount,
    sql: text,
    params: filters,
  };
}

function answerMessages(question: string, plan: SemanticPlan, result: ViewResult): ChatMessage[] {
  const entry = REGISTRY.find((v) => v.id === plan.view_id);
  const meta = JSON.stringify({
    id: entry?.id, name_zh: entry?.name_zh, formula: entry?.formula,
    grain: entry?.grain, time_window: entry?.time_window, notes: entry?.notes,
  }, null, 2);
  const truncated = result.rows.slice(0, 20);
  return [
    { role: 'system', content: ANSWER_SYSTEM },
    {
      role: 'user',
      content: (
        `【用户问题】\n${question}\n\n` +
        `【视图口径】\n${meta}\n\n` +
        `【查询结果】（columns/rows；共 ${result.rowCount} 行，超出 20 行截断展示）\n` +
        `columns: ${JSON.stringify(result.columns)}\n` +
        `rows: ${JSON.stringify(truncated)}\n\n` +
        `【实际执行的 SQL】（仅作为口径依据引用，不向用户展示原文）\n${result.sql}`
      ),
    },
  ];
}

// ---------------- 编排主链路 ----------------

export async function askQuestion(question: string, opts: AskOptions = {}): Promise<AskResult> {
  const base = { question, provider_used: PROVIDER_USED };

  // 校验·第一道：域边界（生成之前拦截，不花规划调用）
  const preViolations = validateQuestion(question);
  if (preViolations.length) {
    return {
      ...base,
      stage: 'blocked',
      reply: `该查询已被校验 Agent 拦截：${preViolations[0].message}`,
      plan: null, planner: null,
      validation: { passed: false, violations: preViolations },
      view: null, data: null, sql: null, params: null,
    };
  }

  const llm = opts.llm ?? (() => {
    const ds = new DeepSeekLLM();
    if (!ds.ready) {
      throw new AskConfigError(
        '未配置 DEEPSEEK_API_KEY。语义问答链路为强制真 LLM 供型，不做 Mock 降级；请在环境变量配置后重试。'
      );
    }
    return ds;
  })();

  // 查询规划 Agent：真 LLM JSON 规划，解析失败重试 1 次 → 规则兜底
  // （LLM 网络失败直接上抛——强制真 LLM 策略下不静默降级）
  const msgs = plannerMessages(question);
  let plan: SemanticPlan;
  let planner: string;
  let turn = await llm.complete(msgs, []);
  try {
    plan = parsePlan(turn.content || '');
    planner = 'llm';
  } catch {
    turn = await llm.complete(msgs, []);          // 解析失败重试一次
    try {
      plan = parsePlan(turn.content || '');
      planner = 'llm_retry';
    } catch {
      const fallback = rulePlan(question);
      if (fallback) { plan = fallback; planner = 'rule_fallback'; }
      else {
        plan = { view_id: null, intent: 'metric_query', filters: {}, reasoning: '规则兜底未命中任何视图' };
        planner = 'rule_fallback_none';
      }
    }
  }

  // 校验·第二道：视图合法性
  const violations = validatePlan(plan);
  if (violations.length) {
    return {
      ...base,
      stage: 'blocked',
      reply: `该查询已被校验 Agent 拦截：${violations.map((v) => v.message).join('；')}`,
      plan, planner,
      validation: { passed: false, violations },
      view: plan.view_id, data: null, sql: null, params: null,
    };
  }

  // 无对应视图：如实相告 + 列出可回答范围
  if (!plan.view_id) {
    const names = REGISTRY.map((v) => v.name_zh).join('、');
    return {
      ...base,
      stage: 'no_view',
      reply: `当前语义视图注册表中没有能回答该问题的视图，不做臆测。已发布视图：${names}。`,
      plan, planner,
      validation: { passed: true, violations: [] },
      view: null, data: null, sql: null, params: null,
    };
  }

  // 执行（machine_check 已在 codegen 期机判）→ 带依据回答
  const result = await (opts.executeView ?? defaultExecuteView)(plan.view_id, plan.filters);
  const answerTurn = await llm.complete(answerMessages(question, plan, result), []);
  return {
    ...base,
    stage: 'answered',
    reply: answerTurn.content || '',
    plan, planner,
    validation: { passed: true, violations: [] },
    view: plan.view_id,
    data: { columns: result.columns, rows: result.rows, rowCount: result.rowCount },
    sql: result.sql, params: result.params,
  };
}
