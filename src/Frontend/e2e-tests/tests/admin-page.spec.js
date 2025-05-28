const { test, expect } = require('@playwright/test');
import { frontend } from '../../src/lib/config';

test.describe('Admin page functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(frontend.urls.loginPage);

    await page.getByPlaceholder('Username').fill('user3');
    await page.getByPlaceholder('Password').fill('password3');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(frontend.urls.homePage);
  });

  test('should display data page with correct content', async ({ page }) => {
    await page.goto(frontend.urls.adminPage);

    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(`${frontend.urls.adminPage}/`);
  });
});