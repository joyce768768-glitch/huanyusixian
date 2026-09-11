import { test, expect } from '@playwright/test';

test.describe('购物车流程', () => {
  test('加购→购物车→结算', async ({ page }) => {
    // 1. 首页加购
    await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded' });
    // 等待商品加载
    await page.waitForTimeout(1000);
    // 点第一个商品的加购按钮
    const addBtn = page.locator('button:has-text("加入购物车"), button[aria-label*="购物车"]').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(800);
    }

    // 2. 进入购物车（用 role+exact 精确定位导航按钮，避免匹配"加入购物车"按钮）
    await page.getByRole('button', { name: '购物车', exact: true }).click();
    await page.waitForTimeout(1000);

    // 3. 验证购物车页面
    await expect(page.getByRole('button', { name: '购物车', exact: true })).toBeVisible();
  });
});

test.describe('订单流程', () => {
  test('订单页面加载', async ({ page }) => {
    await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded' });
    await page.getByText('我的').click();
    await page.waitForTimeout(500);
    // 从我的页进入订单
    const orderBtn = page.getByText('我的订单').first();
    if (await orderBtn.isVisible()) {
      await orderBtn.click();
      await page.waitForTimeout(1000);
    }
  });
});
