const { test, expect } = require('@playwright/test');
import { frontend } from '../../src/lib/config';

test.describe('Login functionality', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto(frontend.urls.loginPage);

    await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME || 'user1');
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD || 'password1');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(frontend.urls.homePage);
    await expect(page.getByText(frontend.content.homePage.line1)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto(frontend.urls.loginPage);

    await page.getByPlaceholder('Username').fill('invalidusername');
    await page.getByPlaceholder('Password').fill('wrongpassword');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(`${frontend.urls.loginPage}/`);
    await expect(page.getByText(frontend.errorMessages.invalidUserNameOrPasswordError)).toBeVisible();
  });
});