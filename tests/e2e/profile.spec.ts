import { test, expect } from '@playwright/test';

const C_HOME = 'http://localhost:3003/';

test.describe('C端"我的"页导航', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '我的', exact: true }).click();
    await page.waitForTimeout(500);
  });

  test('我的页加载 → 展示功能菜单与会员信息', async ({ page }) => {
    await expect(page.getByText('我的收藏')).toBeVisible();
    await expect(page.getByText('我的钱包')).toBeVisible();
    await expect(page.getByText('我的优惠券')).toBeVisible();
    await expect(page.getByText('收货地址')).toBeVisible();
  });

  test('进入各子页可正常返回', async ({ page }) => {
    const subPages = ['我的钱包', '我的优惠券', '收货地址', '分销伙伴', '会员中心'];
    for (const name of subPages) {
      await page.getByText(name).first().click();
      await page.waitForTimeout(600);
      // 进入带子页头部的页面 → 返回按钮可见
      const backBtn = page.getByRole('button', { name: '返回' });
      await expect(backBtn).toBeVisible({ timeout: 8000 });
      await backBtn.click();
      await page.waitForTimeout(400);
      // 回到我的页
      await expect(page.getByText('我的收藏')).toBeVisible();
    }
  });

  test('我的订单入口 → 进入订单列表', async ({ page }) => {
    await page.getByRole('button', { name: '全部订单' }).click();
    await page.waitForTimeout(800);
    await expect(page.getByRole('heading', { name: '全部订单' })).toBeVisible({ timeout: 8000 });
    // 订单状态 Tab 存在（顶部筛选栏第一个）
    await expect(page.getByRole('button', { name: '待发货' }).first()).toBeVisible();
  });

  test('我的收藏入口 → 进入收藏页', async ({ page }) => {
    await page.getByText('我的收藏').first().click();
    await page.waitForTimeout(600);
    await expect(page.getByRole('button', { name: '返回' })).toBeVisible({ timeout: 8000 });
  });
});
