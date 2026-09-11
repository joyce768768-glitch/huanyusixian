import { test, expect, request as pwRequest } from '@playwright/test';

const C_HOME = 'http://localhost:3003/';
const API = 'http://localhost:4000/api';
const TARGET_PRODUCT = 'PRD-008'; // 安徒生童话精选 · 典藏版
const TARGET_KEYWORD = '安徒生';

test.describe('B端↔C端 商品上下架联动', () => {
  test.afterAll(async () => {
    // 兜底恢复上架，避免用例失败污染演示环境
    const api = await pwRequest.newContext();
    await api.put(`${API}/products/${TARGET_PRODUCT}/status`, { data: { status: 'online' } });
    await api.dispose();
  });

  test('B端下架商品后，C端首页不再展示；重新上架后恢复', async ({ page, request }) => {
    // 前置：确保商品在线
    await request.put(`${API}/products/${TARGET_PRODUCT}/status`, { data: { status: 'online' } });
    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    const searchInput = page.locator('input[placeholder*="搜索"]').first();
    await searchInput.fill(TARGET_KEYWORD);
    await page.waitForTimeout(600);
    // 在线时可搜到
    await expect(page.locator('.card').filter({ hasText: TARGET_KEYWORD }).first()).toBeVisible({ timeout: 8000 });
    await searchInput.clear();

    // B端操作：通过后台 API 下架
    const offline = await request.put(`${API}/products/${TARGET_PRODUCT}/status`, { data: { status: 'offline' } });
    expect(offline.ok()).toBeTruthy();

    // C端重新加载，列表接口已过滤下架商品
    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.locator('input[placeholder*="搜索"]').first().fill(TARGET_KEYWORD);
    await page.waitForTimeout(600);
    await expect(page.locator('.card').filter({ hasText: TARGET_KEYWORD })).toHaveCount(0);

    // B端重新上架
    const online = await request.put(`${API}/products/${TARGET_PRODUCT}/status`, { data: { status: 'online' } });
    expect(online.ok()).toBeTruthy();

    // C端再次加载，商品恢复展示
    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.locator('input[placeholder*="搜索"]').first().fill(TARGET_KEYWORD);
    await page.waitForTimeout(600);
    await expect(page.locator('.card').filter({ hasText: TARGET_KEYWORD }).first()).toBeVisible({ timeout: 8000 });
  });
});
