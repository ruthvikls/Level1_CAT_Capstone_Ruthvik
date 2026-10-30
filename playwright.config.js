// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 30*1000,
  expect: {
  timeout: 5000
  },
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true
    
  },

projects: [
  {
    name: 'setup',
    testMatch: '**/auth.setup.js',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup'],
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
    dependencies: ['setup'],
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
    dependencies: ['setup'],
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 5'] },
    dependencies: ['setup'],
  },
],
});

