import { test as base, expect, Page } from '@playwright/test'
import { testData, generateTestUser } from './test-data'

// Path to store authenticated state
export const STORAGE_STATE = 'e2e/.auth/user.json'

/**
 * Extended test fixtures with authentication helpers
 */
export const test = base.extend<{
  authenticatedPage: Page
  testUser: typeof testData.testUser
}>({
  // Provide a fresh test user for each test
  testUser: async ({}, use) => {
    await use(generateTestUser())
  },

  // Authenticated page fixture
  authenticatedPage: async ({ page }, use) => {
    // Check if we have stored auth state
    // If not, this fixture expects the test to handle auth
    await use(page)
  },
})

/**
 * Login helper function
 */
export async function login(
  page: Page,
  credentials: { email: string; password: string }
) {
  await page.goto('/login')
  
  // Wait for login form
  await page.waitForSelector('input[type="email"]')
  
  // Fill credentials
  await page.fill('input[type="email"]', credentials.email)
  await page.fill('input[type="password"]', credentials.password)
  
  // Submit form
  await page.click('button[type="submit"]')
  
  // Wait for redirect to dashboard or success state
  await page.waitForURL(/\/(dashboard|onboarding|settings)/, { timeout: 15000 })
}

/**
 * Signup helper function
 */
export async function signup(
  page: Page,
  userData: { email: string; password: string; companyName: string }
) {
  await page.goto('/signup')
  
  // Wait for signup form
  await page.waitForSelector('input#companyName')
  
  // Fill signup form
  await page.fill('input#companyName', userData.companyName)
  await page.fill('input#email', userData.email)
  await page.fill('input#password', userData.password)
  
  // Submit form
  await page.click('button[type="submit"]')
  
  // Wait for success message or redirect
  // Note: In real tests, you'd need to handle email confirmation
  await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 10000 })
}

/**
 * Signup and auto-confirm (for test environments with disabled email confirmation)
 */
export async function signupAndLogin(
  page: Page,
  userData: { email: string; password: string; companyName: string }
) {
  // First, attempt signup
  await signup(page, userData)
  
  // In test environment, you might auto-confirm the user via API
  // or have email confirmation disabled
  
  // Then login
  await login(page, { email: userData.email, password: userData.password })
}

/**
 * Logout helper function
 */
export async function logout(page: Page) {
  // Navigate to settings or find logout button
  await page.goto('/settings')
  
  // Click logout button if visible
  const logoutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout")')
  if (await logoutButton.isVisible()) {
    await logoutButton.click()
  }
  
  // Wait for redirect to login page
  await page.waitForURL(/\/(login|\/)/, { timeout: 10000 })
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.goto('/dashboard')
    await page.waitForURL('/dashboard', { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

/**
 * Wait for API response helper
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  options?: { timeout?: number }
) {
  const timeout = options?.timeout || 10000
  return page.waitForResponse(
    (response) => {
      const url = response.url()
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern)
      }
      return urlPattern.test(url)
    },
    { timeout }
  )
}

export { expect }
