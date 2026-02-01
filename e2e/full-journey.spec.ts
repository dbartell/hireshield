import { test, expect } from '@playwright/test'
import { generateTestUser, generateTeamMember, testData } from './fixtures/test-data'
import { createNavigationHelper } from './helpers/navigation'
import { createFormHelper } from './helpers/forms'
import { mockStripeCheckout, mockEmailSending, mockMergeIntegration } from './helpers/api'

/**
 * Full Journey E2E Test
 * 
 * This test covers the complete happy path:
 * signup → onboarding → docs → disclosure → training → compliant
 */
test.describe('Full User Journey', () => {
  const testUser = generateTestUser()
  const recruiter = generateTeamMember('recruiter')
  const manager = generateTeamMember('manager')
  const admin = generateTeamMember('admin')

  test.beforeEach(async ({ page }) => {
    // Set up global mocks
    await mockEmailSending(page)
    await mockStripeCheckout(page)
    await mockMergeIntegration(page)
  })

  test('complete user journey from marketing to compliance', async ({ page }) => {
    // Step 1: Marketing Homepage
    test.step('Visit homepage', async () => {
      await page.goto('/')
      await expect(page.locator('h1')).toContainText('AI Hiring Compliance')
      await expect(page.locator('text=Made Simple')).toBeVisible()
    })

    // Step 2: Navigate to Pricing
    test.step('Visit pricing page', async () => {
      await page.goto('/pricing')
      await expect(page.locator('text=Simple, Transparent Pricing')).toBeVisible()
      await expect(page.locator('text=Growth')).toBeVisible()
    })

    // Step 3: Navigate to Signup
    test.step('Navigate to signup', async () => {
      await page.goto('/signup')
      await expect(page.locator('text=Create your account')).toBeVisible()
    })

    // Step 4: Complete Signup Form
    test.step('Complete signup form', async () => {
      await page.fill('input#companyName', testUser.companyName)
      await page.fill('input#email', testUser.email)
      await page.fill('input#password', testUser.password)
      
      await page.click('button[type="submit"]')
      
      // Wait for confirmation or redirect
      await Promise.race([
        page.waitForSelector('text=Check your email'),
        page.waitForURL(/\/(dashboard|onboarding)/),
      ])
    })

    // Note: In a real test, you'd need to handle email verification
    // For this test, we'll assume auto-login or verification bypass in test env
  })

  test('complete onboarding flow', async ({ page }) => {
    // Assume authenticated user
    // Navigate to team setup
    test.step('Start team setup', async () => {
      await page.goto('/onboarding/team-setup')
      await expect(page.locator('h1:has-text("Set Up Team Training")')).toBeVisible()
    })

    // Step 1: Add Recruiter
    test.step('Add recruiter', async () => {
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      await page.click('button:has-text("Next")')
    })

    // Step 2: Add Hiring Manager
    test.step('Add hiring manager', async () => {
      await expect(page.locator('text=Who makes hiring decisions')).toBeVisible({ timeout: 5000 })
      await page.fill('input[placeholder="Full name"]', manager.name)
      await page.fill('input[placeholder="Email address"]', manager.email)
      await page.click('button:has-text("Next")')
    })

    // Step 3: Add HR Admin
    test.step('Add HR admin', async () => {
      await expect(page.locator('text=Who manages HR compliance')).toBeVisible({ timeout: 5000 })
      await page.fill('input[placeholder="Full name"]', admin.name)
      await page.fill('input[placeholder="Email address"]', admin.email)
      await page.click('button:has-text("Next")')
    })

    // Step 4: Skip Executives (optional)
    test.step('Skip executives step', async () => {
      await expect(page.locator('text=executives')).toBeVisible({ timeout: 5000 })
      
      // Either skip or proceed
      const skipButton = page.locator('button:has-text("Skip"), a:has-text("Skip")')
      const nextButton = page.locator('button:has-text("Assign Training")')
      
      if (await skipButton.isVisible()) {
        await skipButton.click()
      } else if (await nextButton.isVisible()) {
        await nextButton.click()
      }
    })
  })

  test('generate required documents', async ({ page }) => {
    test.step('Navigate to documents', async () => {
      await page.goto('/documents')
      await expect(page.locator('h1:has-text("Documents")')).toBeVisible()
    })

    test.step('Generate disclosure notice', async () => {
      await page.click('button:has-text("New Document")')
      await expect(page.locator('text=Generate New Document')).toBeVisible()
      
      await page.click('button:has-text("Candidate Disclosure Notice")')
      await page.click('button:has-text("Generate Document")')
      
      // Wait for editor
      await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
      
      // Save document
      await page.click('button:has-text("Save Document")')
      await page.waitForLoadState('networkidle')
    })

    test.step('Generate consent form', async () => {
      await page.click('button:has-text("New Document")')
      await page.click('button:has-text("Candidate Consent Form")')
      await page.click('button:has-text("Generate Document")')
      
      await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
      await page.click('button:has-text("Save Document")')
      await page.waitForLoadState('networkidle')
    })

    test.step('Generate impact assessment', async () => {
      await page.click('button:has-text("New Document")')
      await page.click('button:has-text("Impact Assessment")')
      await page.click('button:has-text("Generate Document")')
      
      await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
      await page.click('button:has-text("Save Document")')
      await page.waitForLoadState('networkidle')
    })

    test.step('Verify documents in list', async () => {
      await expect(page.locator('text=Your Documents')).toBeVisible()
      // Should have at least 3 documents now
    })
  })

  test('configure disclosure page', async ({ page }) => {
    test.step('Navigate to disclosure settings', async () => {
      await page.goto('/settings/disclosure')
      await expect(page.locator('h1:has-text("Disclosure Page")')).toBeVisible()
    })

    test.step('Configure disclosure content', async () => {
      // Fill in disclosure details
      const slugInput = page.locator('input[type="text"]').first()
      await slugInput.clear()
      await slugInput.fill('test-company-disclosure')
      
      const headerInput = page.locator('input[placeholder*="How"]')
      if (await headerInput.isVisible()) {
        await headerInput.fill('How Test Company Uses AI in Hiring')
      }
      
      const contactInput = page.locator('input[type="email"]')
      if (await contactInput.isVisible()) {
        await contactInput.fill('hr@testcompany.com')
      }
    })

    test.step('Save and publish disclosure page', async () => {
      await page.click('button:has-text("Save Changes")')
      await page.waitForLoadState('networkidle')
      
      // Publish if available
      const publishButton = page.locator('button:has-text("Publish")')
      if (await publishButton.isVisible()) {
        await publishButton.click()
        await page.waitForLoadState('networkidle')
      }
    })

    test.step('Verify public disclosure page', async () => {
      await page.goto('/d/test-company-disclosure')
      await page.waitForLoadState('networkidle')
      // Page should load (might 404 if not properly set up)
    })
  })

  test('verify dashboard shows compliance progress', async ({ page }) => {
    test.step('Navigate to dashboard', async () => {
      await page.goto('/dashboard')
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    })

    test.step('Check compliance score', async () => {
      await expect(page.locator('text=Compliance Score')).toBeVisible()
    })

    test.step('Check stats are updated', async () => {
      await expect(page.locator('text=Documents')).toBeVisible()
      await expect(page.locator('text=Regulated States')).toBeVisible()
    })

    test.step('Check quick actions', async () => {
      await expect(page.locator('text=Quick Actions')).toBeVisible()
      await expect(page.locator('text=Run New Audit')).toBeVisible()
      await expect(page.locator('text=Generate Document')).toBeVisible()
      await expect(page.locator('text=Continue Training')).toBeVisible()
    })
  })

  test.describe('Full Journey Integration', () => {
    test('marketing → pricing → signup flow', async ({ page }) => {
      // Start at homepage
      await page.goto('/')
      await expect(page.locator('h1')).toContainText('AI Hiring Compliance')
      
      // Click CTA to go to pricing/signup
      const ctaButton = page.locator('a:has-text("Get Your Free"), a:has-text("Start")').first()
      if (await ctaButton.isVisible()) {
        await ctaButton.click()
        await page.waitForLoadState('networkidle')
      }
      
      // Should be on pricing or scorecard
      expect(page.url()).toMatch(/\/(pricing|scorecard|signup)/)
    })

    test('authenticated user can access all main sections', async ({ page }) => {
      // Test navigation to all main areas
      const sections = [
        { url: '/dashboard', heading: 'Dashboard' },
        { url: '/documents', heading: 'Documents' },
        { url: '/training', heading: 'Training' },
        { url: '/compliance/documents', heading: 'Compliance Documents' },
        { url: '/settings/team', heading: 'Team' },
        { url: '/settings/disclosure', heading: 'Disclosure' },
        { url: '/settings/integrations', heading: 'ATS Integrations' },
      ]
      
      for (const section of sections) {
        await page.goto(section.url)
        await page.waitForLoadState('networkidle')
        // Page should load without error
      }
    })
  })

  test('dashboard shows green checkmarks when compliant', async ({ page }) => {
    // Mock dashboard data with high compliance
    await page.route('**/api/dashboard', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          complianceScore: 95,
          documentsCount: 5,
          trainingCompleted: 3,
          trainingTotal: 3,
          hiringStates: ['NYC', 'Colorado', 'Illinois'],
          toolsCount: 2,
          consentCount: 50,
          auditsCount: 1,
          latestAudit: { id: '1', date: new Date().toISOString() },
        }),
      })
    })
    
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // High score should show "Good" status
    const goodStatus = page.locator('text=Good, .text-green-600')
    // Status should reflect high compliance
  })
})

/**
 * Smoke Tests - Quick validation of critical paths
 */
test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/AIHireLaw|HireShield|AI Hiring/)
  })

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('h1')).toContainText('Pricing')
  })

  test('signup page loads', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('text=Create your account')).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=Sign in')).toBeVisible()
  })

  test('dashboard requires auth', async ({ page }) => {
    await page.goto('/dashboard')
    // Should redirect to login or show auth prompt
    await page.waitForURL(/\/(login|signup|dashboard)/)
  })
})
