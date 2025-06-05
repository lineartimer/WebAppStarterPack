const { test, expect } = require('@playwright/test');
import { frontend } from '../../src/lib/config';

test.describe('Data page functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(frontend.urls.pages.loginPage);

    await page.getByPlaceholder('Username').fill('user1');
    await page.getByPlaceholder('Password').fill('password1');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(frontend.urls.pages.homePage);
  });

  test('should display data page with correct content', async ({ page }) => {
    await page.goto(frontend.urls.pages.dataPage);

    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(`${frontend.urls.pages.dataPage}`);
    await expect(page.locator('table')).toBeVisible();
    
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should not display admin page', async ({ page }) => {
    await page.goto(frontend.urls.pages.adminPage);

    await page.waitForLoadState('networkidle');
    
    await expect(page).not.toHaveURL(`${frontend.urls.pages.adminPage}`);
    await expect(page).toHaveURL(`https://localhost:3000${frontend.urls.pages.homePage}`);
  });
});