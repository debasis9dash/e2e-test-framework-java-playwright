import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openRoom(roomId: number, checkinIso: string, checkoutIso: string): Promise<void> {
    await this.goto(
      `/reservation/${roomId}?checkin=${encodeURIComponent(checkinIso)}&checkout=${encodeURIComponent(checkoutIso)}`,
    );
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectRoomBookingChromeVisible(roomName: RegExp | string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: roomName })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Book This Room' })).toBeVisible();
  }

  async openReserveGuestForm(): Promise<void> {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
    await expect(this.page.getByRole('textbox', { name: 'Firstname' })).toBeVisible();
  }

  async fillGuestDetails(params: {
    firstName: string;
    lastName: string;
    email: string;
    /** 11–21 characters per site validation */
    phone: string;
  }): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Firstname' }).fill(params.firstName);
    await this.page.getByRole('textbox', { name: 'Lastname' }).fill(params.lastName);
    await this.page.getByRole('textbox', { name: 'Email' }).fill(params.email);
    await this.page.getByRole('textbox', { name: 'Phone' }).fill(params.phone);
  }

  async submitGuestReservation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
  }

  async expectBookingConfirmed(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible({
      timeout: 20_000,
    });
    await expect(this.page.getByText(/Your booking has been confirmed/i)).toBeVisible();
  }
}
