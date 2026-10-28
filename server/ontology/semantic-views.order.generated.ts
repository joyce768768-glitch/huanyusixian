// ================================================================
// 自动生成：semantic-contract compiler codegen（勿手改，Git 即版本）
// 实体：huanyu.order v0.1.0 · 方言：postgresql
// 重新生成：python -m semantic_contract codegen <entity> --out <本文件>
// ================================================================

export interface SemanticTimeWindow { type: string; days: number; anchor: string; }

export interface SemanticViewDef {
  id: string;
  nameZh: string;
  formula: string;
  grain: string[];
  timeWindow: SemanticTimeWindow;
  notes: string;
  dialect: string;
  sql: string;
}

export const semanticViews: SemanticViewDef[] = [
  {
    "id": "huanyu.view.avg_order_value",
    "nameZh": "客单价",
    "formula": "avg(total_amount) by day",
    "grain": [
      "day"
    ],
    "timeWindow": {
      "type": "rolling",
      "days": 30,
      "anchor": "\"orders\".\"time\""
    },
    "notes": "经营核心指标；金额口径唯一来源 orders.\"totalAmount\"（元）",
    "dialect": "postgresql",
    "sql": "SELECT \"orders\".\"time\"::date AS \"day\", avg(\"orders\".\"totalAmount\") AS \"avg_order_value\", sum(\"orders\".\"totalAmount\") AS \"gmv\", count(*) AS \"n\"\nFROM \"orders\"\nWHERE (\"orders\".\"time\")::date >= current_date - 30\nGROUP BY 1\nORDER BY 1"
  },
  {
    "id": "huanyu.view.repeat_purchase_rate",
    "nameZh": "复购率",
    "formula": "count(下单≥2次的会员) / count(有订单的会员)",
    "grain": [],
    "timeWindow": {
      "type": "rolling",
      "days": 30,
      "anchor": "\"orders\".\"time\""
    },
    "notes": "会员留存质量；窗口内按会员去重",
    "dialect": "postgresql",
    "sql": "SELECT count(*) FILTER (WHERE order_count >= 2) AS repeat_members,\n       count(*) AS total_members,\n       round((count(*) FILTER (WHERE order_count >= 2))::numeric\n             / nullif(count(*), 0), 4) AS repeat_rate\nFROM (\n  SELECT \"userId\", count(*) AS order_count\n  FROM \"orders\"\n  WHERE (\"orders\".\"time\")::date >= current_date - 30\n  GROUP BY \"userId\"\n) t\n"
  },
  {
    "id": "huanyu.view.order_status_distribution",
    "nameZh": "订单状态分布",
    "formula": "count(*) by day, status_code",
    "grain": [
      "day",
      "status_code"
    ],
    "timeWindow": {
      "type": "rolling",
      "days": 7,
      "anchor": "\"orders\".\"time\""
    },
    "notes": "履约漏斗底座（待付款→待发货→已发货→完成/退款/取消）",
    "dialect": "postgresql",
    "sql": "SELECT \"orders\".\"statusCode\" AS \"status_code\", \"orders\".\"time\"::date AS \"day\", count(*) AS \"order_count\"\nFROM \"orders\"\nWHERE (\"orders\".\"time\")::date >= current_date - 7\nGROUP BY 1, 2\nORDER BY 1, 2"
  },
  {
    "id": "huanyu.view.distributor_structure",
    "nameZh": "分销商订单结构",
    "formula": "count(*) as 订单数, sum(total_amount) as 销售额 by dist_id",
    "grain": [
      "dist_id"
    ],
    "timeWindow": {
      "type": "rolling",
      "days": 30,
      "anchor": "\"orders\".\"time\""
    },
    "notes": "分销佣金盘子的底座；dist_id 为空即直销单",
    "dialect": "postgresql",
    "sql": "SELECT \"orders\".\"distId\" AS \"dist_id\", count(*) AS \"order_count\", sum(\"orders\".\"totalAmount\") AS \"sales_amount\"\nFROM \"orders\"\nWHERE (\"orders\".\"time\")::date >= current_date - 30\nGROUP BY 1\nORDER BY 1"
  }
];

export function findView(id: string): SemanticViewDef | undefined {
  return semanticViews.find((v) => v.id === id);
}

export function viewRegistry() {
  return semanticViews.map(({ sql: _sql, ...meta }) => meta); // 纯语义，供 LLM prompt 注入
}

/** :name 具名参数 → node-pg 的 $n 物化 */
export function materialize(
  sql: string,
  params: Record<string, unknown> = {},
): { text: string; values: unknown[] } {
  const values: unknown[] = [];
  const text = sql.replace(/:(\w+)/g, (_m, name: string) => {
    if (!(name in params)) return `:${name}`;
    values.push(params[name]);
    return `$${values.length}`;
  });
  return { text, values };
}
