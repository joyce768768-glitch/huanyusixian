// ================================================================
// 自动生成：semantic-contract compiler codegen（勿手改，Git 即版本）
// 实体：huanyu.offering v0.2.0 · 方言：postgresql
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
    "id": "huanyu.view.mystery_sales_share",
    "nameZh": "盲盒销售占比",
    "formula": "sum(盲盒订单行收入) / sum(全部订单行收入) by day",
    "grain": [
      "day"
    ],
    "timeWindow": {
      "type": "rolling",
      "days": 30,
      "anchor": "\"orders\".\"time\""
    },
    "notes": "卖法结构健康度（M2 口径调整：物理层无逐单成本，毛利率 blocked，先以销售占比观察盲盒盘子）",
    "dialect": "postgresql",
    "sql": "SELECT \"orders\".\"time\"::date AS \"day\", sum(CASE WHEN \"offerings\".\"saleType\" = 'mystery'\n    THEN \"orderItems\".\"price\" * \"orderItems\".\"quantity\" ELSE 0 END)::float\n/ nullif(sum(\"orderItems\".\"price\" * \"orderItems\".\"quantity\"), 0)\n AS \"mystery_sales_share\", count(*) AS \"n\"\nFROM \"orderItems\"\nINNER JOIN \"offerings\" ON \"orderItems\".\"productId\" = \"offerings\".\"productId\"\nINNER JOIN \"orders\" ON \"orderItems\".\"orderId\" = \"orders\".\"id\"\nWHERE (\"orders\".\"time\")::date >= current_date - 30\nGROUP BY 1\nORDER BY 1"
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
