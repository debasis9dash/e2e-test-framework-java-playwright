import { expect, test } from '../fixtures/testFixtures';
import { defaultStayDates } from '../utils/TestDataGenerator';

test.describe('Booking panel', () => {
  test('check availability section is reachable from hash route', async ({ bookingPage }) => {
    await bookingPage.openFromHome();
    await bookingPage.expectCheckAvailabilityVisible();
  });
});

test.describe('Reservation', () => {
  test('single room page shows booking widget', async ({ reservationPage }) => {
    const { checkin, checkout } = defaultStayDates();
    await reservationPage.openRoom(1, checkin, checkout);
    await reservationPage.expectRoomBookingChromeVisible(/Single Room/i);
  });

  test('double room page shows booking widget and similar rooms', async ({ reservationPage, page }) => {
    const { checkin, checkout } = defaultStayDates();
    await reservationPage.openRoom(2, checkin, checkout);
    await reservationPage.expectRoomBookingChromeVisible(/Double Room/i);
    await expect(page.getByRole('heading', { name: 'Similar Rooms You Might Like' })).toBeVisible();
  });
});
