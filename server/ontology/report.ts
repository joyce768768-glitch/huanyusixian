// ================================================================
// M4 Data Agent · 报表编排（寰宇域）：NL 问题 → 多节复合报表
//
// 与契约仓库 reporting.py（canonical 模板）对齐的 TS 落地，在 M3 单问编排
// （askQuestion）之上叠报表层：
//   报表规划：语义注册表注入 prompt（铁律①）→ 真 LLM 拆解 2-4 节子问题
//   逐节执行：每节复用 askQuestion 全链路（SC-V001 域边界 / SC-V002 视图
//             合法性 / codegen 期 machine_check，逐节不旁路）
//   异常标注：声明式业务规则机判（M4 设计决策：语义层管「数从哪来」，
//             应用层管「数怎么判」；规则可配置、报表可解释）
//   汇总：真 LLM 基于各节叙述 + 机器异常标注产出 summary + insights
//         （数字只从各节引用，口径差异必须提示；解析失败降级机械拼装）
//
// 供型：强制真 LLM（DeepSeek），无 key 抛 AskConfigError → 路由转 503。
// ================================================================
import { askQuestion, AskConfigError, REGISTRY, type AskOptions, type AskResult } from './ask';
import { type ChatMessage, type LLMProvider, DeepSeekLLM } from '../agent/llm';

// ---------------- 类型 ----------------

export interface ReportPlan {
  title: string;
  sections: { question: string; rationale: string }[];
}

export interface AnomalyMatch {
  column: string;
  value: number;
  share?: number;
  row: unknown;
}

export interface Anomaly {
  rule_id: string;
  label: string;
  describe: string;
  basis: string;
  unit: string;
  threshold: number;
  mode: 'cell' | 'share';
  matched_count: number;
  matched: AnomalyMatch[];
}

export interface ReportSection {
  question: string;
  rationale: string;
  stage: AskResult['stage'];
  reply: string | null;
  view: string | null;
  view_name: string | null;
  planner: string | null;
  validation: AskResult['validation'];
  data: AskResult['data'];
  sql: string | null;
  provenance: unknown;
  anomalies: Anomaly[];
}

export interface ReportResult {
  question: string;
  title: string;
  generated_at: string;
  planner: string;
  provider_used: string;
  sections: ReportSection[];
  summary: string;
  insights: string[];
  insights_machine: string[];
  summary_degraded: boolean;
  stats: { sections_total: number; sections_answered: number; sections_blocked: number };
  stage: 'answered';
}

export class ReportPlanParseError extends Error {}

export interface ReportOptions extends AskOptions {
  /** 测试注入用：报表级 LLM（不传则与逐节链路同源，强制真 LLM） */
  reportLlm?: LLMProvider;
}

// ---------------- 声明式异常规则（应用层业务判定；阈值可配置、basis 可解释） ----------------

export const ANOMALY_RULES: Record<string, AnomalyRuleDecl[]> = {
  // 分销集中度：单一分销商 GMV 占比超过一半 → 渠道健康度风险（share 模式）
  'huanyu.view.distributor_structure': [
    {
      rule_id: 'huanyu.anomaly.dist_concentration',
      label: '分销集中度风险',
      describe: '单一分销商销售额占比超过一半',
      basis: '渠道健康度经验阈值 50%（演示口径，业务可配置）',
      unit: '',
      column: 'sales_amount',
      op: '>',
      threshold: 0.5,
      mode: 'share',
    },
  ],
};

interface AnomalyRuleDecl {
  rule_id: string;
  label: string;
  describe: string;
  basis: string;
  unit: string;
  column: string;
  op: '>' | '>=' | '<' | '<=';
  threshold: number;
  mode: 'cell' | 'share';
}

function rulesFor(viewId: string | null): AnomalyRuleDecl[] {
  return (viewId && ANOMALY_RULES[viewId]) || [];
}

function numOf(v: unknown): number | null {
  if (v == null || typeof v === 'boolean') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const OPS: Record<AnomalyRuleDecl['op'], (a: number, b: number) => boolean> = {
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
};

/** 声明式异常规则求值（canonical：契约仓库 reporting.apply_anomaly_rules）。
 *  行格式兼容 list（SQLite）与 dict（PG）两种执行器产物。 */
export function applyAnomalyRules(
  rules: AnomalyRuleDecl[],
  columns: string[],
  rows: unknown[],
): Anomaly[] {
  const out: Anomaly[] = [];
  if (!rules?.length) return out;
  const colIndex = new Map(columns.map((c, i) => [c, i]));
  for (const rule of rules) {
    const idx = colIndex.get(rule.column);
    const op = OPS[rule.op];
    if (idx === undefined || !op) continue;

    const raw = (row: unknown): unknown =>
      Array.isArray(row) ? row[idx] : row && typeof row === 'object' ? (row as Record<string, unknown>)[rule.column] : undefined;

    const mode = rule.mode ?? 'cell';
    let total: number | null = null;
    if (mode === 'share') {
      total = rows.reduce<number>((s, row) => s + (numOf(raw(row)) ?? 0), 0);
    }
    const matched: AnomalyMatch[] = [];
    for (const row of rows) {
      const num = numOf(raw(row));
      if (num == null) continue;
      const value = mode === 'share' && total ? num / total : num;
      if (op(value, rule.threshold)) {
        matched.push({ column: rule.column, value, row, ...(mode === 'share' ? { share: value } : {}) });
      }
    }
    if (matched.length) {
      out.push({
        rule_id: rule.rule_id, label: rule.label,
        describe: rule.describe || `${rule.column} ${rule.op} ${rule.threshold}`,
        basis: rule.basis || '', unit: rule.unit || '',
        threshold: rule.threshold, mode,
        matched_count: matched.length, matched,
      });
    }
  }
  return out;
}

// ---------------- 报表规划 Agent（canonical：契约仓库 reporting.py） ----------------

const MAX_SECTIONS = 4;

const REPORT_PLANNER_SYSTEM = `你是「报表规划 Agent」。把用户的经营/统计问题拆解为一份多节报表计划：每节回答该问题的一个子角度，合并后能完整回答用户问题。

【语义视图注册表】（口径唯一真相源；每个子问题都必须能被其中某个视图回答，不含任何物理表结构）
{registry}

【规则】
1. 拆解 2-${MAX_SECTIONS} 节；每节 question 是一个独立的统计子问题（不是原问题的复述）。
2. 注册表覆盖不了的侧面不要拆节——每节都必须能命中注册表中的某个视图。
3. 各节角度互补（如：总量 → 结构 → 异常/趋势），禁止两节问同一件事。
4. rationale 用一句话说明该节对回答主问题的作用。
5. 只输出一个 JSON 对象，不要输出任何其他文字：
{"title": "报表标题", "sections": [{"question": "子问题1", "rationale": "…"}, {"question": "子问题2", "rationale": "…"}]}`;

function reportPlannerMessages(question: string): ChatMessage[] {
  const registry = JSON.stringify(REGISTRY, null, 2);
  return [
    { role: 'system', content: REPORT_PLANNER_SYSTEM.replace('{registry}', registry) },
    { role: 'user', content: question },
  ];
}

function extractJson(raw: string): string | null {
  const tagged = raw.match(/<json>\s*(\{[\s\S]*?\})\s*<\/json>/i);
  if (tagged) return tagged[1];
  const fenced = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (fenced) return fenced[1];
  const bare = raw.match(/\{[\s\S]*\}/);
  return bare ? bare[0] : null;
}

export function parseReportPlan(raw: string): ReportPlan {
  const jsonStr = extractJson((raw || '').trim());
  if (!jsonStr) throw new ReportPlanParseError('输出中未找到 JSON 对象');
  let data: any;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new ReportPlanParseError(`JSON 解析失败: ${(e as Error).message}`);
  }
  if (typeof data !== 'object' || data === null) throw new ReportPlanParseError('报表计划不是 JSON 对象');
  const rawSections = data.sections;
  if (!Array.isArray(rawSections) || rawSections.length === 0) {
    throw new ReportPlanParseError('sections 必须是非空数组');
  }
  const sections = rawSections
    .filter((s: any) => s && typeof s === 'object' && String(s.question || '').trim())
    .map((s: any) => ({ question: String(s.question).trim(), rationale: String(s.rationale || '') }));
  if (!sections.length) throw new ReportPlanParseError('sections 中没有任何带 question 的节');
  return { title: String(data.title || '').trim(), sections };
}

/** 结构校验（节数上限 / question 非空）；单节允许（退化直查的合法形态） */
export function validateReportPlan(plan: ReportPlan): string[] {
  const violations: string[] = [];
  if (plan.sections.length > MAX_SECTIONS) {
    violations.push(`报表节数 ${plan.sections.length} 超过上限 ${MAX_SECTIONS}`);
  }
  plan.sections.forEach((s, i) => {
    if (!s.question.trim()) violations.push(`第 ${i + 1} 节缺少子问题 question`);
  });
  return violations;
}

// ---------------- 汇总 Agent（canonical：契约仓库 reporting.py） ----------------

const REPORT_SUMMARY_SYSTEM = `你是数据分析助手，基于一份报表各节的回答，写整体汇总与洞察。

【规则】
1. summary：3-5 句话直接回答用户的主问题；数字只能来自【各节回答】或【机器异常标注】，禁止编造、外推或凭记忆补充。
2. 必须点明关键口径：时间窗、指标公式；各节口径有差异时（如滚动窗口≠自然月）必须提示。
3. insights：0-3 条，每条一句话；优先级：机器异常标注 > 口径提示 > 节间对比；没有可说时输出空数组。
4. 被拦截/无数据的节如实说明，不臆测原因。
5. 用中文，只输出一个 JSON 对象，不要输出任何其他文字：
{"summary": "…", "insights": ["…", "…"]}`;

function sectionDigest(sec: ReportSection, maxRows = 12) {
  return {
    section_question: sec.question,
    stage: sec.stage,
    view: sec.view,
    reply: sec.reply,
    columns: sec.data?.columns ?? [],
    rows: (sec.data?.rows ?? []).slice(0, maxRows),
    row_count: sec.data?.rowCount ?? 0,
    anomalies: sec.anomalies,
  };
}

function reportSummaryMessages(question: string, title: string, sections: ReportSection[]): ChatMessage[] {
  const digests = sections.map((s) => sectionDigest(s));
  return [
    { role: 'system', content: REPORT_SUMMARY_SYSTEM },
    {
      role: 'user',
      content: `【用户主问题】\n${question}\n\n【报表标题】\n${title}\n\n【各节回答摘要】\n${JSON.stringify(digests, null, 2)}`,
    },
  ];
}

export function parseReportSummary(raw: string): { summary: string; insights: string[] } {
  const jsonStr = extractJson((raw || '').trim());
  if (!jsonStr) throw new ReportPlanParseError('汇总输出中未找到 JSON 对象');
  let data: any;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new ReportPlanParseError(`汇总 JSON 解析失败: ${(e as Error).message}`);
  }
  if (typeof data !== 'object' || data === null) throw new ReportPlanParseError('汇总输出不是 JSON 对象');
  const insights = (Array.isArray(data.insights) ? data.insights : [])
    .map((x: unknown) => String(x ?? '').trim())
    .filter(Boolean);
  return { summary: String(data.summary || '').trim(), insights };
}

// ---------------- 报表编排主链路 ----------------

const PROVIDER_USED = 'openai_compatible(deepseek)';

function defaultReportLlm(): LLMProvider {
  const ds = new DeepSeekLLM();
  if (!ds.ready) {
    throw new AskConfigError(
      '未配置 DEEPSEEK_API_KEY。报表链路为强制真 LLM 供型，不做 Mock 降级；请在环境变量配置后重试。'
    );
  }
  return ds;
}

async function planReport(question: string, llm: LLMProvider): Promise<{ plan: ReportPlan; planner: string }> {
  const msgs = reportPlannerMessages(question);
  let planner = 'llm';
  for (let attempt = 1; attempt <= 2; attempt++) {
    const turn = await llm.complete(msgs, []);
    try {
      const plan = parseReportPlan(turn.content || '');
      if (!validateReportPlan(plan).length) {
        if (!plan.title) plan.title = `「${question}」数据报表`;
        return { plan, planner };
      }
    } catch (e) {
      if (!(e instanceof ReportPlanParseError)) throw e;
    }
    planner = 'llm_retry';
  }
  // 两次均失败 → 退化为单节直查（原问题走完整 M3 链路，鲁棒性手段非 Mock）
  return {
    plan: { title: `「${question}」数据报表`, sections: [{ question, rationale: '报表规划退化：原问题直查' }] },
    planner: 'fallback_single_section',
  };
}

async function runSections(plan: ReportPlan, opts: ReportOptions): Promise<ReportSection[]> {
  const out: ReportSection[] = [];
  for (const section of plan.sections) {
    const res = await askQuestion(section.question, opts);
    const viewName = REGISTRY.find((v) => v.id === res.view)?.name_zh ?? null;
    const anomalies = applyAnomalyRules(
      rulesFor(res.view),
      res.data?.columns ?? [],
      res.data?.rows ?? [],
    );
    out.push({
      question: section.question,
      rationale: section.rationale,
      stage: res.stage,
      reply: res.reply,
      view: res.view,
      view_name: viewName,
      planner: res.planner,
      validation: res.validation,
      data: res.data,
      sql: res.sql,
      provenance: res.sql ? { sql: res.sql, params: res.params } : null,
      anomalies,
    });
  }
  return out;
}

async function summarize(
  question: string,
  plan: ReportPlan,
  sections: ReportSection[],
  llm: LLMProvider,
): Promise<{ summary: string; insights: string[]; summary_degraded: boolean }> {
  const msgs = reportSummaryMessages(question, plan.title, sections);
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const turn = await llm.complete(msgs, []);
      return { ...parseReportSummary(turn.content || ''), summary_degraded: false };
    } catch (e) {
      if (!(e instanceof ReportPlanParseError)) throw e;
    }
  }
  // 汇总解析失败 → 机械拼装（数字全部来自真实节叙述，不编造），不丢弃整份报表
  const joined = sections.filter((s) => s.reply).map((s) => `${s.question}：${s.reply}`).join(' ');
  return { summary: joined || '各节均未取得数据。', insights: [], summary_degraded: true };
}

export async function askReport(question: string, opts: ReportOptions = {}): Promise<ReportResult> {
  const llm = opts.reportLlm ?? opts.llm ?? defaultReportLlm();

  const { plan, planner } = await planReport(question, llm);
  const sections = await runSections(plan, opts);
  const summaryOut = await summarize(question, plan, sections, llm);

  const insights_machine = sections.flatMap((s) =>
    s.anomalies.map(
      (a) =>
        `${s.view_name || s.question}：${a.label}——${a.describe}（命中 ${a.matched_count} 行；判定依据：${a.basis}）`
    ),
  );
  const answered = sections.filter((s) => s.stage === 'answered').length;
  const blocked = sections.filter((s) => s.stage === 'blocked' || s.stage === 'no_view').length;

  return {
    question,
    title: plan.title,
    generated_at: new Date().toISOString().slice(0, 19),
    planner,
    provider_used: PROVIDER_USED,
    sections,
    summary: summaryOut.summary,
    insights: summaryOut.insights,
    insights_machine,
    summary_degraded: summaryOut.summary_degraded,
    stats: { sections_total: sections.length, sections_answered: answered, sections_blocked: blocked },
    stage: 'answered',
  };
}
