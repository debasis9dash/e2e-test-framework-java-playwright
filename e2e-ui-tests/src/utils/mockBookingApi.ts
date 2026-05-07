import type { Page, Route } from '@playwright/test';

type BookingPayload = {
  roomid?: number;
  firstname?: string;
  lastname?: string;
  depositpaid?: boolean;
  bookingdates?: { checkin: string; checkout: string };
  email?: string;
  phone?: string;
};

/**
 * Stubs POST /api/booking (Playwright URL glob) with HTTP 201 and JSON matching the live booking API
 * (captured from automationintesting.online). Keeps UI confirmation tests stable when the demo is flaky.
 */
export async function installBookingCreateStub(page: Page): Promise<void> {
  await page.route('**/api/booking', async (route: Route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    let payload: BookingPayload = {};
    const raw = route.request().postData();
    if (raw) {
      try {
        payload = JSON.parse(raw) as BookingPayload;
      } catch {
        /* ignore malformed */
      }
    }

    const body = {
      bookingid: Math.floor(Math.random() * 1_000_000) + 1_000_000,
      depositpaid: Boolean(payload.depositpaid),
      firstname: String(payload.firstname ?? 'Guest'),
      lastname: String(payload.lastname ?? 'User'),
      roomid: typeof payload.roomid === 'number' ? payload.roomid : 1,
      bookingdates: payload.bookingdates ?? {
        checkin: '2026-01-01',
        checkout: '2026-01-03',
      },
    };

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function uninstallBookingCreateStub(page: Page): Promise<void> {
  await page.unroute('**/api/booking');
}
