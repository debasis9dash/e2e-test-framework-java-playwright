import { expect, test } from '../../fixtures/testFixtures';

test.describe('Admin session (critical path)', () => {
  test('rejects invalid credentials', async ({ adminLoginPage, page }) => {
    await adminLoginPage.open();
    await adminLoginPage.login('admin', `wrong-password-${Date.now()}`);
    await expect(page.locator('.alert-danger').filter({ hasText: /Invalid credentials/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('successful login reaches room management', async ({ adminLoginPage, page }) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) {
      test.skip(
        true,
        'Set ADMIN_USERNAME and ADMIN_PASSWORD (copy e2e-ui-tests/.env.example → .env for the public demo, or use CI secrets).',
      );
      return;
    }

    await adminLoginPage.open();
    await adminLoginPage.login(username, password);
    await adminLoginPage.expectAdminRoomsDashboard();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Report' })).toBeVisible();
  });
});
