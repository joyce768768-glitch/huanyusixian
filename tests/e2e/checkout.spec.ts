import { test, expect, request as pwRequest, type Page } from '@playwright/test';

const C_HOME = 'http://localhost:3003/';

// 在支付抽屉中输入 6 位支付密码（任意数字即触发支付，前端不校验密码内容）
// 支付成功后 ProductDetail/Cart 都会跳转到订单页
async function inputPayPasswordAndExpectOrders(page: Page) {
  const tel = page.locator('input[type="tel"]').first();
  await tel.waitFor({ state: 'attached' });
  await tel.fill('123456');
  // 支付成功 → 跳转订单列表，新订单状态为"待发货"
  await expect(page.getByRole('heading', { name: '全部订单' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('待发货').first()).toBeVisible();
}

test.describe('C端购买结算全流程', () => {
  test('立即购买 → 支付成功', async ({ page }) => {
    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    // 进入第一个商品详情
    await page.locator('.card').first().click();
    await expect(page.getByRole('button', { name: '立即购买' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: '立即购买' }).click();
    await expect(page.getByText('确认付款')).toBeVisible();

    await inputPayPasswordAndExpectOrders(page);
  });

  test('立即购买 → 选择优惠券抵扣 → 支付成功', async ({ page }) => {
    // 先通过 API 领取新人礼包，确保存在可用的 unused 满99减20券
    const api = await pwRequest.newContext();
    await api.post('http://localhost:4000/api/coupons/new-user-gift');
    await api.dispose();

    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    // 搜索高价商品（森林探秘 128 元，满足满99券门槛）
    const searchInput = page.locator('input[placeholder*="搜索"]').first();
    await searchInput.fill('森林');
    await page.waitForTimeout(600);
    await page.locator('.card').first().click();
    await expect(page.getByRole('button', { name: '立即购买' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: '立即购买' }).click();
    await expect(page.getByText('确认付款')).toBeVisible();

    // 打开优惠券选择器并选第一张满99可用券
    await expect(page.getByText('选择优惠券')).toBeVisible({ timeout: 8000 });
    await page.getByText('选择优惠券').click();
    await page.locator('button').filter({ hasText: /满.?99可用/ }).first().click();
    // 选中后出现减免金额 20.00
    await expect(page.locator('button').filter({ hasText: /20\.00/ }).first()).toBeVisible();

    await inputPayPasswordAndExpectOrders(page);
  });

  test('购物车加购 → 结算 → 支付成功', async ({ page }) => {
    await page.goto(C_HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    // 加购一件商品
    await page.getByRole('button', { name: '加入购物车' }).first().click();
    await expect(page.getByText('已加入购物车')).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(1000);

    // 进入购物车
    await page.getByRole('button', { name: '购物车', exact: true }).click();
    await page.waitForTimeout(1000);

    // 点击悬浮栏"结算 (N)"
    const settleBtn = page.locator('button', { hasText: '结算' });
    await expect(settleBtn).toBeVisible();
    await settleBtn.click();
    await expect(page.getByText('确认付款')).toBeVisible({ timeout: 8000 });

    await inputPayPasswordAndExpectOrders(page);
  });
});
