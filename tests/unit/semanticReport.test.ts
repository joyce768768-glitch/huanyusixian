// ================================================================
// M4 报表编排测试（寰宇域）：多节规划 / 声明式异常规则 / 汇总降级
// 供型为强制真 LLM：测试注入 ScriptedLLM 回放 + executeView 执行桩。
// ================================================================
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  askReport, applyAnomalyRules, parseReportPlan, parseReportSummary,
  validateReportPlan, ReportPlanParseError,
  type ReportPlan,
} from '../../server/ontology/report';
import { AskConfigError } from '../../server/ontology/ask';
import { ScriptedLLM, type LlmTurn } from '../../server/agent/llm';
import type { ViewResult } from '../../server/ontology/ask';

const REPORT_PLAN: ReportPlan = {
  title: '盲盒经营月报',
  sections: [
    { question: '上月分销渠道销售额结构怎么样？', rationale: '结构侧面' },
    { question: '上月客单价什么水平？', rationale: '量价侧面' },
  ],
};

const PLAN_DIST: LlmTurn = {
  content: JSON.stringify({
    view_id: 'huanyu.view.distributor_structure',
    intent: 'metric_query', filters: {}, reasoning: '问分销结构',
  }),
  toolCalls: [],
};
const PLAN_AOV: LlmTurn = {
  content: JSON.stringify({
    view_id: 'huanyu.view.avg_order_value',
    intent: 'metric_query', filters: {}, reasoning: '问客单价',
  }),
  toolCalls: [],
};
const SUMMARY: LlmTurn = {
  content: JSON.stringify({
    summary: '分销集中度偏高；客单价平稳。口径：滚动 30 天 ≠ 自然月，需注意。',
    insights: ['口径提示：滚动 30 天 ≠ 自然月'],
  }),
  toolCalls: [],
};

// PG 侧 rows 为 dict 形态；d1 占 60% → 命中集中度规则
const DIST_RESULT: ViewResult = {
  columns: ['dist_id', 'sales_amount'],
  rows: [{ dist_id: 'd1', sales_amount: 600 }, { dist_id: 'd2', sales_amount: 300 }, { dist_id: 'd3', sales_amount: 100 }],
  rowCount: 3,
  sql: 'SELECT ...',
  params: {},
};
const AOV_RESULT: ViewResult = {
  columns: ['day', 'avg_order_value', 'n'],
  rows: [{ day: '2026-10-27', avg_order_value: 128.5, n: 40 }],
  rowCount: 1,
  sql: 'SELECT ...',
  params: {},
};

function stubExecute(): NonNullable<import('../../server/ontology/ask').AskOptions['executeView']> {
  return async (viewId) => (viewId === 'huanyu.view.distributor_structure' ? DIST_RESULT : AOV_RESULT);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

// ---------------- 报表计划解析与校验 ----------------

describe('parseReportPlan', () => {
  it('兼容 裸 JSON / 围栏 / <json> 标签', () => {
    const body = JSON.stringify(REPORT_PLAN);
    for (const raw of [body, '```json\n' + body + '\n```', '前言\n<json>' + body + '</json>']) {
      const plan = parseReportPlan(raw);
      expect(plan.title).toBe('盲盒经营月报');
      expect(plan.sections).toHaveLength(2);
    }
  });
  it('空 sections / 无 JSON 抛 ReportPlanParseError', () => {
    expect(() => parseReportPlan(JSON.stringify({ title: 't', sections: [] }))).toThrow(ReportPlanParseError);
    expect(() => parseReportPlan('拆不出来')).toThrow(ReportPlanParseError);
  });
});

describe('validateReportPlan', () => {
  it('超过 4 节拦截；单节允许（退化直查是合法形态）', () => {
    const five = { title: 't', sections: Array.from({ length: 5 }, (_, i) => ({ question: `q${i}` })) };
    expect(validateReportPlan(five as ReportPlan)).toHaveLength(1);
    expect(validateReportPlan({ title: 't', sections: [{ question: 'q', rationale: '' }] })).toHaveLength(0);
  });
});

// ---------------- 汇总解析 ----------------

describe('parseReportSummary', () => {
  it('解析 summary + insights；空 insights 过滤为空数组', () => {
    const out = parseReportSummary(JSON.stringify({ summary: 's', insights: ['a', ''] }));
    expect(out).toEqual({ summary: 's', insights: ['a'] });
    expect(() => parseReportSummary('not json')).toThrow(ReportPlanParseError);
  });
});

// ---------------- 声明式异常规则 ----------------

describe('applyAnomalyRules', () => {
  const RULE = {
    rule_id: 'huanyu.anomaly.dist_concentration', label: '分销集中度风险',
    describe: '单一分销商销售额占比超过一半', basis: '渠道健康度经验阈值 50%',
    unit: '', column: 'sales_amount', op: '>' as const, threshold: 0.5, mode: 'share' as const,
  };
  it('share 模式：d1 占 60% 命中，占比按列总和计算', () => {
    const out = applyAnomalyRules([RULE], DIST_RESULT.columns, DIST_RESULT.rows);
    expect(out).toHaveLength(1);
    expect(out[0].matched_count).toBe(1);
    expect(out[0].matched[0].share).toBeCloseTo(0.6);
    expect(out[0].matched[0].row).toEqual({ dist_id: 'd1', sales_amount: 600 });
  });
  it('未过半不命中；畸形规则跳过', () => {
    const rows = [{ dist_id: 'd1', sales_amount: 30 }, { dist_id: 'd2', sales_amount: 30 }, { dist_id: 'd3', sales_amount: 40 }];
    expect(applyAnomalyRules([RULE], ['sales_amount'], rows)).toHaveLength(0);
    expect(applyAnomalyRules([{ ...RULE, column: 'ghost' }], DIST_RESULT.columns, DIST_RESULT.rows)).toHaveLength(0);
  });
});

// ---------------- 报表编排主链路 ----------------

describe('askReport', () => {
  it('LLM 拆节 → 逐节 M3 链路 → 异常机判 → 汇总（happy path）', async () => {
    const llm = new ScriptedLLM([
      { content: JSON.stringify(REPORT_PLAN), toolCalls: [] },  // 报表规划
      PLAN_DIST,                                                // 节1 规划
      { content: '上月分销 d1 渠道占 60%，集中度偏高（口径：sum(sales) by dist）。', toolCalls: [] },
      PLAN_AOV,                                                 // 节2 规划
      { content: '上月客单价 128.5 元（口径：sum(amount)/count(distinct order)）。', toolCalls: [] },
      SUMMARY,                                                  // 汇总
    ]);
    const out = await askReport('上月盲盒卖得怎么样？', { llm, executeView: stubExecute() });
    expect(out.stage).toBe('answered');
    expect(out.title).toBe('盲盒经营月报');
    expect(out.planner).toBe('llm');
    expect(out.stats).toEqual({ sections_total: 2, sections_answered: 2, sections_blocked: 0 });
    // 异常机判：share 规则命中 d1，机器洞察可解释
    expect(out.sections[0].anomalies).toHaveLength(1);
    expect(out.insights_machine[0]).toContain('分销集中度风险');
    expect(out.insights_machine[0]).toContain('判定依据');
    // 汇总来自 LLM，未降级
    expect(out.summary_degraded).toBe(false);
    expect(out.summary).toContain('滚动 30 天');
    // 调用序列：规划 → 节1(规划+回答) → 节2(规划+回答) → 汇总 = 6 次
    expect(llm.calls).toHaveLength(6);
    // 铁律①：报表规划 prompt 只含语义注册表，无物理表名
    const planPrompt = llm.calls[0].messages[0].content;
    expect(planPrompt).toContain('分销商订单结构');
    expect(planPrompt).not.toContain('orderItems');
    // 机器异常标注进汇总 prompt
    expect(llm.calls[5].messages[1].content).toContain('dist_concentration');
  });

  it('报表规划两次失败 → 退化单节直查（原问题走完整链路）', async () => {
    const llm = new ScriptedLLM([
      { content: '我拆不出来。', toolCalls: [] },
      { content: '还是拆不出来。', toolCalls: [] },
      PLAN_DIST,
      { content: '分销结构如上。', toolCalls: [] },
      SUMMARY,
    ]);
    const out = await askReport('上月分销结构怎么样？', { llm, executeView: stubExecute() });
    expect(out.planner).toBe('fallback_single_section');
    expect(out.stats.sections_answered).toBe(1);
    expect(out.sections[0].question).toBe('上月分销结构怎么样？');
  });

  it('节内 SC-V001 越界 → 该节拦截，不拖垮整份报表', async () => {
    const llm = new ScriptedLLM([
      { content: JSON.stringify({ title: '混合报表', sections: [
        { question: '上月分销渠道销售额结构怎么样？', rationale: '正常节' },
        { question: '上月毛利率多少？', rationale: '越界节（物理层缺 cost）' },
      ] }), toolCalls: [] },
      PLAN_DIST,
      { content: '分销结构如上。', toolCalls: [] },
      SUMMARY,
    ]);
    const out = await askReport('上月经营情况', { llm, executeView: stubExecute() });
    expect(out.stage).toBe('answered');
    expect(out.stats).toEqual({ sections_total: 2, sections_answered: 1, sections_blocked: 1 });
    expect(out.sections[1].stage).toBe('blocked');
    expect(out.sections[1].reply).toContain('毛利率');  // 治理解释 + 替代推荐
    expect(llm.calls).toHaveLength(4);  // 越界节生成前被拦截，不花 LLM 调用
  });

  it('汇总两次解析失败 → 机械拼装降级（节数据不受影响）', async () => {
    const llm = new ScriptedLLM([
      { content: JSON.stringify({ title: '单节报表', sections: [{ question: '上月分销渠道销售额结构怎么样？', rationale: '单节' }] }), toolCalls: [] },
      PLAN_DIST,
      { content: 'd1 渠道占 60%。', toolCalls: [] },
      { content: '不是 JSON', toolCalls: [] },
      { content: '还不是', toolCalls: [] },
    ]);
    const out = await askReport('上月分销结构怎么样？', { llm, executeView: stubExecute() });
    expect(out.summary_degraded).toBe(true);
    expect(out.summary).toContain('d1 渠道占 60%');
    expect(out.sections[0].data?.rowCount).toBe(3);
  });

  it('无 key 抛 AskConfigError（强制真 LLM，不做 Mock 降级）', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', '');
    await expect(askReport('上月盲盒卖得怎么样？')).rejects.toThrow(AskConfigError);
  });
});
