import { test as base } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { BookingPage } from '../pages/BookingPage';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { LegalPage } from '../pages/LegalPage';
import { ReservationPage } from '../pages/ReservationPage';

type Pages = {
  homePage: HomePage;
  bookingPage: BookingPage;
  reservationPage: ReservationPage;
  adminLoginPage: AdminLoginPage;
  legalPage: LegalPage;
  contactPage: ContactPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
  reservationPage: async ({ page }, use) => {
    await use(new ReservationPage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  legalPage: async ({ page }, use) => {
    await use(new LegalPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

export { expect } from '@playwright/test';
