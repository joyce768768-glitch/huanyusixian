// ================================================================
// 本体层 API（供 P3 Agent 工具层调用，也可前端直接接语义搜索）
//
// 这些接口返回的是"带判定结论的事实"，而不是裸数据：
// Agent 拿到 verdict 就知道能不能承诺、该怎么反问，不需要自己猜业务规则。
// ================================================================
import express from 'express';
import {
  searchBooks, listOfferings, resolveBookRequest, findBookByTitle,
  mysteryDisclosure, checkAgeFit, parseIntent,
} from '../ontology/query';
import { resolveTheme, resolveAgeMonths, THEMES, lexiconView, resolveDomain, resolveSaleType, detectIntent } from '../ontology/lexicon';
import { CONCEPTS, RELATIONS, ontologyAsPromptText, } from '../ontology/concepts';
import { RULE_INDEX } from '../ontology/rules';
import { pool } from '../db/client';
// M2 语义视图层：契约仓库编译器 codegen 产物（勿手改，重新生成命令见文件头）
import { semanticViews as offeringViews, materialize } from '../ontology/semantic-views.offering.generated';
import { semanticViews as orderViews } from '../ontology/semantic-views.order.generated';
// M3 双 Agent 编排：查询规划 Agent + 校验 Agent + 带依据回答
import { askQuestion, AskConfigError } from '../ontology/ask';

const router = express.Router();

const ALL_VIEWS = [...offeringViews, ...orderViews];

/** 语义检索：传自然语言，返回结构化命中 + 卖法 */
router.get('/search', async (req, res) => {
  try {
    const { q = '', theme, age, ageMonths, limit } = req.query;
    const explicitMonths = ageMonths != null ? Number(ageMonths)
      : (age != null ? resolveAgeMonths(String(age))?.min ?? null : null);
    const hits = await searchBooks({
      text: String(q),
      theme: theme ? String(theme) : null,
      ageMonths: explicitMonths,
      limit: limit ? Number(limit) : 10,
    });
    res.json({
      success: true,
      data: hits,
      // 回显解析出的意图，便于前端/Agent 校验理解是否正确（歧义时可反问）
      intent: parseIntent({ text: String(q), theme: theme ? String(theme) : null, ageMonths: explicitMonths }),
    });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 一本书的所有卖法（能否指定、价格、库存） */
router.get('/books/:id/offerings', async (req, res) => {
  try {
    const offerings = await listOfferings(req.params.id);
    res.json({ success: true, data: offerings });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/**
 * 用户点名要某本书 → 能否承诺 + 可购买卖法。
 * 这是"盲盒冲突"的支点接口。
 */
router.get('/books/:id/resolve', async (req, res) => {
  try {
    const book = await findBookByTitle(req.params.id);
    const bookId = book?.id ?? req.params.id;
    const result = await resolveBookRequest(bookId);
    if (result.offerings.length === 0) {
      return res.status(404).json({ success: false, message: '未找到该书的卖法记录' });
    }
    res.json({ success: true, data: result });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 按书名定位内容实体 */
router.get('/books/by-title', async (req, res) => {
  try {
    const { title = '' } = req.query;
    const book = await findBookByTitle(String(title));
    if (!book) return res.status(404).json({ success: false, message: '未找到该书' });
    res.json({ success: true, data: book });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 适龄校验 */
router.get('/books/:id/age-fit', async (req, res) => {
  try {
    const months = Number(req.query.ageMonths);
    if (!Number.isFinite(months)) {
      return res.status(400).json({ success: false, message: '缺少合法的 ageMonths' });
    }
    res.json({ success: true, data: await checkAgeFit(req.params.id, months) });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 盲盒概率可否披露 */
router.get('/products/:id/mystery-disclosure', async (req, res) => {
  try {
    res.json({ success: true, data: await mysteryDisclosure(req.params.id) });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 词表解析（调试/前端联想用） */
router.get('/parse', (req, res) => {
  const { q = '' } = req.query;
  const text = String(q);
  const domain = resolveDomain(text);
  const intent = detectIntent(text);
  res.json({
    success: true,
    data: {
      theme: resolveTheme(text),
      saleType: resolveSaleType(text),
      age: resolveAgeMonths(text),
      intent: parseIntent({ text }),
      themes: THEMES,
      // 运维诊断：领域词命中 + 确定性意图预判（分歧监控口径同源）
      domain: domain ? { domain: domain.domain, hit: domain.hit } : null,
      predictedIntent: intent,
    },
  });
});

/** 词表自省：口语→标准值的受控映射（读内存缓存，事实源为 lexicon_terms 表） */
router.get('/lexicon', (_req, res) => {
  const lex = lexiconView();
  res.json({
    success: true,
    data: {
      themes: THEMES,
      themeSynonyms: lex.theme,
      saleTypeSynonyms: lex.saleType,
      domainSynonyms: lex.domain,
      stage: lex.stage,
    },
  });
});

/** 本体自省：概念/关系/规则清单（P3 可直接注入 prompt） */
router.get('/schema', (_req, res) => {
  res.json({
    success: true,
    data: { concepts: CONCEPTS, relations: RELATIONS, rules: RULE_INDEX },
    promptText: ontologyAsPromptText(),
  });
});

/** 策略参数（运营可调，Agent 判定依据） */
router.get('/policies', async (_req, res) => {
  try {
    const r = await pool.query(`SELECT key, value FROM "policies" ORDER BY key`);
    const map: Record<string, any> = {};
    r.rows.forEach((row: any) => { map[row.key] = row.value; });
    res.json({ success: true, data: map });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 语义视图注册表（M2）：纯语义元数据，直接可注入 LLM prompt（blocked 视图已被编译器隐藏） */
router.get('/views', (_req, res) => {
  res.json({
    success: true,
    data: ALL_VIEWS.map(({ sql: _sql, ...meta }) => meta),
  });
});

/** 语义视图执行（M2）：:name 具名参数 → $n 物化后走数据底座，返回数据 + 实际 SQL（带依据） */
router.post('/views/:id/query', async (req, res) => {
  const view = ALL_VIEWS.find((v) => v.id === req.params.id);
  if (!view) return res.status(404).json({ success: false, message: `未注册视图: ${req.params.id}` });
  const filters = (req.body?.filters ?? {}) as Record<string, unknown>;
  try {
    const { text, values } = materialize(view.sql, filters);
    const r = await pool.query(text, values);
    res.json({
      success: true,
      data: {
        view: view.id,
        columns: r.fields.map((f: any) => f.name),
        rows: r.rows,
        rowCount: r.rowCount,
        sql: text,
        params: filters,
      },
    });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

/** 语义问答（M3）：双 Agent 编排主链路。供型为强制真 LLM——
 *  无 key 返回 503 配置指引，不做 Mock 降级；LLM 网络失败如实上报 502。 */
router.post('/ask', async (req, res) => {
  const question = String(req.body?.question ?? '').trim();
  if (!question) return res.status(400).json({ success: false, message: 'question 不能为空' });
  try {
    const out = await askQuestion(question);
    return res.json({ success: true, data: out });
  } catch (e: any) {
    if (e instanceof AskConfigError) {
      return res.status(503).json({ success: false, message: e.message });
    }
    return res.status(502).json({ success: false, message: `LLM 调用失败: ${e?.message ?? e}` });
  }
});

// 表 → 架构层归属（B 端数据底座可视化用）
const LAYER_OF: Record<string, '数据层' | '本体层'> = {
  books: '本体层', offerings: '本体层', offeringItems: '本体层', policies: '本体层',
};
const DATA_TABLES = [
  'users', 'products', 'orders', 'orderItems', 'orderEvents', 'members', 'distributors',
  'partners', 'financeRecords', 'wallets', 'walletTransactions', 'logisticsTemplates',
  'shippingAddresses', 'permissions', 'marketingActivities', 'userAddresses',
  'userCoupons', 'favorites', 'cartItems', 'books', 'offerings', 'offeringItems', 'policies',
];

/** 数据底座：各表行数 + 连接状态（供 B 端数据层页展示） */
router.get('/db-stats', async (_req, res) => {
  try {
    const out: { table: string; layer: string; rows: number }[] = [];
    for (const t of DATA_TABLES) {
      const r = await pool.query(`SELECT count(*)::int AS c FROM "${t}"`);
      out.push({ table: t, layer: LAYER_OF[t] ?? '数据层', rows: r.rows[0].c });
    }
    // 连接健康：pg 版本 + 后端库名
    const meta = await pool.query(`SELECT current_database() AS db, version() AS ver`);
    res.json({
      success: true,
      data: {
        tables: out,
        db: meta.rows[0].db,
        server: String(meta.rows[0].ver).split(',')[0],
        totalRows: out.reduce((s, x) => s + x.rows, 0),
      },
    });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
