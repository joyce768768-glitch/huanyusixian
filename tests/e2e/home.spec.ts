import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('首页正常加载', async ({ page }) => {
    await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('开盒有惊喜')).toBeVisible();
    await expect(page.getByText('首页')).toBeVisible();
    await expect(page.getByText('购物车')).toBeVisible();
    await expect(page.getByText('我的')).toBeVisible();
  });

  test('搜索框可输入（非只读）', async ({ page }) => {
    await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded' });
    const searchInput = page.locator('input[placeholder*="搜索"]').first();
    await expect(searchInput).not.toHaveAttribute('readonly');
    await searchInput.fill('森林');
    await expect(searchInput).toHaveValue('森林');
  });

  test('分类筛选切换', async ({ page }) => {
    await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded' });
    // 等待商品加载（科普自然分类按钮出现）
    await expect(page.getByRole('button', { name: '科普自然' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: '科普自然' }).click();
    await page.waitForTimeout(500);
    // 验证分类切换后页面仍正常
    await expect(page.getByRole('button', { name: '全部' })).toBeVisible();
  });
});
