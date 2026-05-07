/** Resolved in playwright.config use.baseURL; exposed for tests that build absolute URLs. */
export function getPublicBaseUrl(): string {
  return (
    process.env.PLAYWRIGHT_BASE_URL ||
    process.env.UI_BASE_URL ||
    'https://automationintesting.online'
  );
}
