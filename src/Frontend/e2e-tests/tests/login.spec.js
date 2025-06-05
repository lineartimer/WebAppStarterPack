const { test, expect } = require('@playwright/test');
import { frontend } from '../../src/lib/config';

test.describe('Login functionality', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto(frontend.urls.pages.loginPage);

    await page.getByPlaceholder('Username').fill('user1');
    await page.getByPlaceholder('Password').fill('password1');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(frontend.urls.pages.homePage);
    await expect(page.getByText(/.Net/i)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto(frontend.urls.pages.loginPage);

    await page.getByPlaceholder('Username').fill('invalidusername');
    await page.getByPlaceholder('Password').fill('wrongpassword');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(`${frontend.urls.pages.loginPage}`);
    await expect(page.getByText(frontend.errorMessages.invalidUserNameOrPasswordError)).toBeVisible();
  });
});