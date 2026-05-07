import { expect, test } from '../fixtures/testFixtures';

test.describe('Legal', () => {
  test('cookie policy page shows policy content', async ({ legalPage }) => {
    await legalPage.openCookiePolicy();
    await legalPage.expectCookiePolicyVisible();
  });

  test('privacy policy page shows notice and data processing section', async ({ legalPage }) => {
    await legalPage.openPrivacyPolicy();
    await legalPage.expectPrivacyPolicyVisible();
  });

  test('footer cookie link from home navigates to cookie policy', async ({ homePage, page }) => {
    await homePage.open();
    await page.getByRole('link', { name: 'Cookie-Policy' }).click();
    await expect(page).toHaveURL(/\/cookie$/);
    await expect(page.getByRole('heading', { name: 'Cookie Policy', exact: true })).toBeVisible();
  });
});
