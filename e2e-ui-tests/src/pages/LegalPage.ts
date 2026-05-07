import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LegalPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openCookiePolicy(): Promise<void> {
    await this.goto('/cookie');
  }

  async openPrivacyPolicy(): Promise<void> {
    await this.goto('/privacy');
  }

  async expectCookiePolicyVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Cookie Policy', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'What is a cookie?' })).toBeVisible();
  }

  async expectPrivacyPolicyVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Privacy Policy Notice' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Processing of your personal data' })).toBeVisible();
  }
}
