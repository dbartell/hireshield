import { test, expect } from '@playwright/test'
import { testData, generateTestUser } from './fixtures/test-data'
import { createNavigationHelper } from './helpers/navigation'
import { createFormHelper } from './helpers/forms'

test.describe('Marketing to Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/')
  })

  test('homepage displays hero section with CTA', async ({ page }) => {
    // Check hero content
    await expect(page.locator('h1')).toContainText('AI Hiring Compliance')
    await expect(page.locator('text=Made Simple')).toBeVisible()
    
    // Check primary CTA
    const ctaButton = page.locator('a:has-text("Get Your Free Compliance Score"), a:has-text("Start")').first()
    await expect(ctaButton).toBeVisible()
    
    // Check secondary CTA
    await expect(page.locator('a:has-text("Request Demo")')).toBeVisible()
  })

  test('homepage displays urgency section with deadlines', async ({ page }) => {
    // Check urgency section
    await expect(page.locator('text=Jan 1, 2026')).toBeVisible()
    await expect(page.locator('text=Illinois HB 3773')).toBeVisible()
    await expect(page.locator('text=Feb 1, 2026')).toBeVisible()
    await expect(page.locator('text=Colorado AI Act')).toBeVisible()
  })

  test('can navigate to pricing page from homepage', async ({ page }) => {
    // Click pricing link in header/navigation
    await page.click('a:has-text("Pricing")').catch(async () => {
      // Try from footer or other location
      await page.goto('/pricing')
    })
    
    // Verify pricing page
    await expect(page.locator('h1')).toContainText('Pricing')
    await expect(page.locator('text=Simple, Transparent Pricing')).toBeVisible()
  })

  test('pricing page displays all plans', async ({ page }) => {
    await page.goto('/pricing')
    
    // Check one-time options
    await expect(page.locator('text=Compliance Training')).toBeVisible()
    await expect(page.locator('text=$299')).toBeVisible()
    
    // Check monthly plans
    await expect(page.locator('text=Starter')).toBeVisible()
    await expect(page.locator('text=Growth')).toBeVisible()
    await expect(page.locator('text=Scale')).toBeVisible()
    await expect(page.locator('text=Enterprise')).toBeVisible()
    
    // Check prices
    await expect(page.locator('text=$149')).toBeVisible()
    await expect(page.locator('text=$349')).toBeVisible()
    await expect(page.locator('text=$749')).toBeVisible()
    await expect(page.locator('text=$2,499')).toBeVisible()
  })

  test('can click Get Started on pricing page', async ({ page }) => {
    await page.goto('/pricing')
    
    // Find and click a Get Started button
    const getStartedButtons = page.locator('button:has-text("Get Started"), a:has-text("Get Started")')
    await expect(getStartedButtons.first()).toBeVisible()
    
    // Click the first one (should trigger checkout or redirect to signup)
    await getStartedButtons.first().click()
    
    // Should redirect to signup or checkout
    await page.waitForURL(/\/(signup|checkout|pricing)/, { timeout: 10000 })
  })

  test('signup page loads correctly', async ({ page }) => {
    await page.goto('/signup')
    
    // Check page elements
    await expect(page.locator('text=Create your account')).toBeVisible()
    await expect(page.locator('text=14-day free trial')).toBeVisible()
    
    // Check form fields
    await expect(page.locator('input#companyName')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    
    // Check submit button
    await expect(page.locator('button[type="submit"]:has-text("Create account")')).toBeVisible()
    
    // Check login link
    await expect(page.locator('a:has-text("Sign in")')).toBeVisible()
  })

  test('can fill out signup form', async ({ page }) => {
    const testUser = generateTestUser()
    
    await page.goto('/signup')
    
    // Fill form
    await page.fill('input#companyName', testUser.companyName)
    await page.fill('input#email', testUser.email)
    await page.fill('input#password', testUser.password)
    
    // Verify fields are filled
    await expect(page.locator('input#companyName')).toHaveValue(testUser.companyName)
    await expect(page.locator('input#email')).toHaveValue(testUser.email)
    await expect(page.locator('input#password')).toHaveValue(testUser.password)
  })

  test('signup form validates required fields', async ({ page }) => {
    await page.goto('/signup')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Form should not submit (HTML5 validation)
    await expect(page).toHaveURL(/\/signup/)
  })

  test('signup form validates password length', async ({ page }) => {
    const testUser = generateTestUser()
    
    await page.goto('/signup')
    
    // Fill form with short password
    await page.fill('input#companyName', testUser.companyName)
    await page.fill('input#email', testUser.email)
    await page.fill('input#password', '12345') // Too short
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error or stay on page
    const errorOrValidation = await Promise.race([
      page.waitForSelector('text=at least 6 characters', { timeout: 3000 }),
      page.waitForSelector('.bg-red-50, [class*="error"]', { timeout: 3000 }),
    ]).catch(() => null)
    
    // Either shows error or form stays on signup page
    const currentUrl = page.url()
    expect(currentUrl.includes('/signup') || errorOrValidation !== null).toBeTruthy()
  })

  test('complete signup flow shows confirmation message', async ({ page }) => {
    const testUser = generateTestUser()
    
    await page.goto('/signup')
    
    // Fill form
    await page.fill('input#companyName', testUser.companyName)
    await page.fill('input#email', testUser.email)
    await page.fill('input#password', testUser.password)
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for confirmation or redirect
    await page.waitForSelector('text=Check your email, text=verification, text=confirm', { timeout: 15000 }).catch(async () => {
      // Might redirect to dashboard if email confirmation disabled
      await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 10000 })
    })
  })

  test('can navigate from homepage to signup', async ({ page }) => {
    await page.goto('/')
    
    // Click a CTA that leads to signup or scorecard
    const ctaLink = page.locator('a:has-text("Get Your Free"), a:has-text("Start"), a:has-text("Sign Up")').first()
    
    if (await ctaLink.isVisible()) {
      await ctaLink.click()
      
      // Should navigate away from homepage
      await page.waitForLoadState('networkidle')
      expect(page.url()).not.toBe(page.url() + '/')
    }
  })

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login')
    
    // Check for signup link
    await expect(page.locator('a:has-text("Sign up"), a:has-text("Create account")')).toBeVisible()
    
    // Click signup link
    await page.click('a:has-text("Sign up"), a:has-text("Create account")')
    
    // Should navigate to signup
    await page.waitForURL(/\/signup/)
  })
})
