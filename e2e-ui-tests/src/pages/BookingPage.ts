import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Booking panel on the home page (#booking). */
export class BookingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openFromHome(): Promise<void> {
    await this.goto('/#booking');
  }

  async expectCheckAvailabilityVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: /Check Availability & Book Your Stay/i }),
    ).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Check Availability' })).toBeVisible();
  }

  async clickCheckAvailability(): Promise<void> {
    await this.page.getByRole('button', { name: 'Check Availability' }).click();
  }
}
