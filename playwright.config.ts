import { defineConfig, devices } from '@playwright/test'

/**
 * HireShield E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Use 1 worker for sequential tests (important for auth state) */
  workers: 1,
  
  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'on-first-retry',
    
    /* Default timeout for actions */
    actionTimeout: 10000,
    
    /* Default navigation timeout */
    navigationTimeout: 30000,
  },

  /* Global timeout for tests */
  timeout: 60000,
  
  /* Expect timeout */
  expect: {
    timeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - runs before all tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
