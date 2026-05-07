import { expect, test } from '../../fixtures/testFixtures';
import { journeyStayDates, uniqueGuestFirstName } from '../../utils/TestDataGenerator';
import { installBookingCreateStub, uninstallBookingCreateStub } from '../../utils/mockBookingApi';

/**
 * Serial: one guest journey at a time.
 * `POST /api/booking` is stubbed (`installBookingCreateStub`) so the UI can reach confirmation
 * without depending on flaky demo/network/RSC behaviour.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Guest booking (critical path)', () => {
  test.afterEach(async ({ page }) => {
    await uninstallBookingCreateStub(page);
  });

  test('from home: check availability → single room → guest details → confirmation', async ({
    bookingPage,
    reservationPage,
    page,
  }) => {
    await installBookingCreateStub(page);
    await bookingPage.openFromHome();
    await bookingPage.expectCheckAvailabilityVisible();
    await bookingPage.clickCheckAvailability();
    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();
    await expect(page.locator('a[href*="/reservation/1"]').first()).toBeVisible();

    // Offer links embed the panel’s default dates (often “today”); use a future stay for a reliable API path.
    const stay = journeyStayDates();
    await reservationPage.openRoom(1, stay.checkin, stay.checkout);
    await expect(page).toHaveURL(/\/reservation\/1\?/);

    await reservationPage.expectRoomBookingChromeVisible(/Single Room/i);
    await reservationPage.openReserveGuestForm();

    const first = uniqueGuestFirstName('Guest');
    await reservationPage.fillGuestDetails({
      firstName: first,
      lastName: 'Playwright',
      email: `e2e.${Date.now()}@example.com`,
      phone: '071234567890',
    });
    await reservationPage.submitGuestReservation();
    await reservationPage.expectBookingConfirmed();
  });

  test('from deep link: complete booking for suite with future dates', async ({ reservationPage, page }) => {
    await installBookingCreateStub(page);
    const { checkin, checkout } = journeyStayDates();
    await reservationPage.openRoom(3, checkin, checkout);
    await reservationPage.expectRoomBookingChromeVisible(/Suite Room/i);

    await reservationPage.openReserveGuestForm();
    const first = uniqueGuestFirstName('Suite');
    await reservationPage.fillGuestDetails({
      firstName: first,
      lastName: 'Journey',
      email: `suite.e2e.${Date.now()}@example.com`,
      phone: '0798765432101',
    });
    await reservationPage.submitGuestReservation();
    await reservationPage.expectBookingConfirmed();
  });
});
