import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/admin');
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectAdminRoomsDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/rooms/);
    await expect(this.page.getByText('Room #').first()).toBeVisible();
    await expect(this.page.getByRole('navigation').getByRole('link', { name: 'Report' })).toBeVisible();
  }
}
