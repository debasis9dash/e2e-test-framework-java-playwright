import { expect, test } from '../fixtures/testFixtures';

test.describe('Site sections', () => {
  test('location hash shows map area and contact information', async ({ homePage }) => {
    await homePage.openLocationSection();
    await homePage.expectOurLocationSection();
    await expect(homePage.navLink('Location')).toBeVisible();
  });

  test('contact hash shows enquiry form fields', async ({ homePage }) => {
    await homePage.openContactSection();
    await homePage.expectContactMessageForm();
  });

  test('rooms nav scroll target keeps room cards and pricing visible', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.navLink('Rooms').click();
    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();
    await expect(page.getByText('£100 per night').first()).toBeVisible();
    await expect(page.getByText('£225 per night').first()).toBeVisible();
  });
});
