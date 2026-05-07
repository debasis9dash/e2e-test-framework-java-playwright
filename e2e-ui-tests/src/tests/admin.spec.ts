import { test } from '../fixtures/testFixtures';

test.describe('Admin', () => {
  test('login screen exposes username, password, and submit', async ({ adminLoginPage }) => {
    await adminLoginPage.open();
    await adminLoginPage.expectLoginFormVisible();
  });
});
