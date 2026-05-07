import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  navLink(name: string): Locator {
    return this.page.getByRole('navigation').first().getByRole('link', { name });
  }

  async expectLandingVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: /Welcome to Shady Meadows B&B/i }),
    ).toBeVisible();
  }

  async expectRoomTypesListed(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Single', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Double', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Suite', exact: true })).toBeVisible();
  }

  async openLocationSection(): Promise<void> {
    await this.goto('/#location');
  }

  async openContactSection(): Promise<void> {
    await this.goto('/#contact');
  }

  async expectOurLocationSection(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Our Location' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();
  }

  async expectContactMessageForm(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Send Us a Message' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
  }
}
