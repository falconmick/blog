import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 600_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    browserName: 'chromium',
    ignoreHTTPSErrors: true,
    serviceWorkers: 'block',
    viewport: { width: 1280, height: 900 }
  }
});
