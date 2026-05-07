import { expect, test } from '../fixtures/testFixtures';

test.describe('Home', () => {
  test('shows hero, primary nav, and room types', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.expectLandingVisible();
    await expect(homePage.navLink('Rooms')).toBeVisible();
    await expect(homePage.navLink('Booking')).toBeVisible();
    await expect(homePage.navLink('Admin')).toBeVisible();
    await homePage.expectRoomTypesListed();
    await expect(page.getByRole('link', { name: 'Book Now' }).first()).toBeVisible();
  });
});
