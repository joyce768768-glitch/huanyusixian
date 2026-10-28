// ================================================================
// M3 双 Agent 编排测试（寰宇域）
//
// 供型为强制真 LLM：传输层用 ScriptedLLM 注入（校验规划/回答的编排逻辑，
// 不测网络、不依赖 PG——执行层用 executeView 桩）；覆盖域边界治理拦截、
// 臆造视图拦截、无视图如实相告、解析失败规则兜底、无 key 配置错误。
// ================================================================
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  askQuestion, AskConfigError, PlanParseError, parsePlan, rulePlan,
  type AskOptions, type ViewResult,
} from '../../server/ontology/ask';
import { ScriptedLLM, type LlmTurn } from '../../server/agent/llm';

const PLAN_SHARE: LlmTurn = {
  content: JSON.stringify({
    view_id: 'huanyu.view.mystery_sales_share',
    intent: 'metric_query',
    filters: {},
    reasoning: '问题问盲盒卖得怎么样，命中 sum(盲盒订单行收入)/sum(全部订单行收入) by day',
  }),
  toolCalls: [],
};

const FAKE_RESULT: ViewResult = {
  columns: ['day', 'mystery_sales_share', 'n'],
  rows: [['2026-10-27', 0.42, 88]],
  rowCount: 1,
  sql: 'SELECT ...',
  params: {},
};

function scripted(responses: LlmTurn[], executeView?: AskOptions['executeView']): AskOptions {
  return { llm: new ScriptedLLM(responses), ...(executeView ? { executeView } : {}) };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

// ---------------- 规划解析 ----------------

describe('parsePlan', () => {
  it('兼容 裸 JSON / ```json 围栏 / <json> 标签 三种输出形状', () => {
    const body = JSON.stringify(PLAN_SHARE.content ? JSON.parse(PLAN_SHARE.content) : {});
    for (const raw of [body, '```json\n' + body + '\n```', '说明\n<json>' + body + '</json>']) {
      const plan = parsePlan(raw);
      expect(plan.view_id).toBe('huanyu.view.mystery_sales_share');
      expect(plan.intent).toBe('metric_query');
    }
  });

  it('无 JSON / 坏 JSON 抛 PlanParseError；臆造 view_id 放行给校验 Agent 拦截', () => {
    expect(() => parsePlan('这个问题我答不了')).toThrow(PlanParseError);
    expect(() => parsePlan('{"view_id": broken}')).toThrow(PlanParseError);
    // 语义问题不归解析管：解析放行，validatePlan 拦截
    expect(parsePlan('{"view_id": "huanyu.view.ghost"}').view_id).toBe('huanyu.view.ghost');
  });
});

describe('rulePlan（解析失败兜底）', () => {
  it('盲盒问题 bigram 命中盲盒销售占比', () => {
    expect(rulePlan('上月盲盒卖得怎么样？')?.view_id).toBe('huanyu.view.mystery_sales_share');
  });
  it('无关问题返回 null', () => {
    expect(rulePlan('今天天气怎么样')).toBeNull();
  });
});

// ---------------- 编排主链路 ----------------

describe('askQuestion', () => {
  it('LLM 规划命中 → 校验通过 → 执行 → 带依据回答（planner=llm）', async () => {
    const llm = new ScriptedLLM([
      PLAN_SHARE,
      { content: '近 30 天盲盒销售占比 42%（口径：盲盒订单行收入 / 全部订单行收入，按日滚动）。', toolCalls: [] },
    ]);
    const out = await askQuestion('上月盲盒卖得怎么样？', {
      llm, executeView: async () => FAKE_RESULT,
    });
    expect(out.stage).toBe('answered');
    expect(out.planner).toBe('llm');
    expect(out.view).toBe('huanyu.view.mystery_sales_share');
    expect(out.data?.rowCount).toBe(1);
    expect(out.reply).toContain('42%');
    // 铁律①：规划 prompt 只含语义注册表，不含物理表名
    const planPrompt = llm.calls[0].messages[0].content;
    expect(planPrompt).toContain('盲盒销售占比');
    expect(planPrompt).not.toContain('orderItems');
    // 铁律②：回答 prompt 带口径公式与结果数据
    const answerPrompt = llm.calls[1].messages[1].content;
    expect(answerPrompt).toContain('盲盒订单行收入');
    expect(answerPrompt).toContain('0.42');
  });

  it('校验·第一道：毛利率类问题在生成之前被治理规则拦截（0 次 LLM 调用）', async () => {
    const llm = new ScriptedLLM([]);
    const out = await askQuestion('上月盲盒毛利率多少？', { llm });
    expect(out.stage).toBe('blocked');
    expect(out.validation.violations[0].rule_id).toBe('SC-V001');
    expect(out.validation.violations[0].message).toContain('cost');
    expect(out.validation.violations[0].message).toContain('盲盒销售占比');   // 给出替代视图
    expect(llm.calls).toHaveLength(0);
  });

  it('校验·第二道：臆造 view_id 被拦截（SC-V002）', async () => {
    const llm = new ScriptedLLM([
      { content: '{"view_id": "huanyu.view.ghost", "intent": "metric_query"}', toolCalls: [] },
    ]);
    const out = await askQuestion('上月铺货率多少？', { llm });
    expect(out.stage).toBe('blocked');
    expect(out.validation.violations[0].rule_id).toBe('SC-V002');
    expect(out.validation.violations[0].message).toContain('臆造');
  });

  it('臆造 id 撞上 blocked 视图时给治理解释而非普通报错', async () => {
    const llm = new ScriptedLLM([
      { content: '{"view_id": "huanyu.view.mystery_gross_margin", "intent": "metric_query"}', toolCalls: [] },
    ]);
    // 问题不含毛利率类关键词（绕过第一道），臆造 id 在第二道撞上 blocked 台账
    const out = await askQuestion('把那个还没上线的视图跑一下', { llm });
    expect(out.stage).toBe('blocked');
    expect(out.validation.violations[0].message).toContain('blocked');
    expect(out.validation.violations[0].message).toContain('cost');
  });

  it('无对应视图：如实相告并列出已发布视图', async () => {
    const llm = new ScriptedLLM([
      { content: '{"view_id": null, "intent": "out_of_scope", "reasoning": "无关问题"}', toolCalls: [] },
    ]);
    const out = await askQuestion('今天午饭吃什么', { llm });
    expect(out.stage).toBe('no_view');
    expect(out.reply).toContain('已发布视图');
    expect(out.reply).toContain('客单价');
  });

  it('解析失败两次 → 规则兜底命中（planner=rule_fallback）', async () => {
    const llm = new ScriptedLLM([
      { content: '抱歉，我不会输出 JSON。', toolCalls: [] },
      { content: '这个嘛……', toolCalls: [] },
      { content: '按口径播报：42%。', toolCalls: [] },
    ]);
    const out = await askQuestion('上月盲盒卖得怎么样？', {
      llm, executeView: async () => FAKE_RESULT,
    });
    expect(out.stage).toBe('answered');
    expect(out.planner).toBe('rule_fallback');
    expect(out.view).toBe('huanyu.view.mystery_sales_share');
    expect(llm.calls).toHaveLength(3);      // 规划×2 + 回答×1
  });

  it('强制真 LLM：未注入且无 DEEPSEEK_API_KEY → AskConfigError', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', '');
    await expect(askQuestion('上月盲盒卖得怎么样？')).rejects.toBeInstanceOf(AskConfigError);
  });
});
