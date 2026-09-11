import { test, expect } from '@playwright/test';

test.describe('B端管理后台', () => {
  test('B端商品列表从API加载', async ({ page }) => {
    await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    // 展开侧边栏（如果折叠）
    const menuBtn = page.locator('button[aria-label*="菜单"], button:has(svg)').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
    // 点商品管理
    await page.getByText('商品管理').click();
    await page.waitForTimeout(1500);
    // 验证有商品数据（PRD开头）
    const prdText = page.locator('text=/PRD-/').first();
    await expect(prdText).toBeVisible({ timeout: 5000 });
  });

  test('B端订单列表从API加载', async ({ page }) => {
    await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const menuBtn = page.locator('button[aria-label*="菜单"], button:has(svg)').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
    await page.getByText('订单管理').click();
    await page.waitForTimeout(1500);
    // 验证有订单数据（LR开头）
    const orderText = page.locator('text=/LR\\d+/').first();
    await expect(orderText).toBeVisible({ timeout: 5000 });
  });

  test('B端收支管理显示汇总数据', async ({ page }) => {
    await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const menuBtn = page.locator('button[aria-label*="菜单"], button:has(svg)').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
    await page.getByText('收支管理').click();
    await page.waitForTimeout(1500);
    await expect(page.getByText('总收入')).toBeVisible();
  });
});
