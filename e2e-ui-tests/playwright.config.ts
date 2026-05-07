import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

loadEnv({ path: path.join(__dirname, '.env') });

/**
 * Public demo UI for the restful-booker-platform stack.
 * CI may set BASE_URL to the API; use PLAYWRIGHT_BASE_URL (or UI_BASE_URL) for the browser app.
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.UI_BASE_URL ||
  'https://automationintesting.online';

export default defineConfig({
  testDir: 'src/tests',
  /** One worker: tests run strictly one after another. */
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
