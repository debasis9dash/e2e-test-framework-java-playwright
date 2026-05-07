import { test } from '../../fixtures/testFixtures';
import { uniqueContactName } from '../../utils/TestDataGenerator';

test.describe('Contact enquiry (critical path)', () => {
  test('submits form and shows personalised thank-you', async ({ contactPage }) => {
    await contactPage.open();
    const displayName = uniqueContactName('Enquirer');
    await contactPage.submitEnquiry({
      name: displayName,
      email: 'enquiry@example.com',
      phone: '012345678901',
      subject: `E2E enquiry ${Date.now()}`,
      message: 'Automated UI test message.',
    });
    await contactPage.expectThankYouHeading(displayName);
  });
});
