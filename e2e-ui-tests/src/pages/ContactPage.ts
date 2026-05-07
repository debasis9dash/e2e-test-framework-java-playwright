import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/#contact');
  }

  /**
   * Site validates phone length (11–21 chars). Uses stable testids on the form.
   */
  async submitEnquiry(params: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await this.page.getByTestId('ContactName').fill(params.name);
    await this.page.getByTestId('ContactEmail').fill(params.email);
    await this.page.getByTestId('ContactPhone').fill(params.phone);
    await this.page.getByTestId('ContactSubject').fill(params.subject);
    await this.page.getByTestId('ContactDescription').fill(params.message);
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async expectThankYouHeading(displayName: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: new RegExp(`Thanks for getting in touch ${displayName}`) }),
    ).toBeVisible();
  }
}
