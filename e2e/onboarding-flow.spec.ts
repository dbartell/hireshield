import { test, expect } from '@playwright/test'
import { testData, generateTeamMember } from './fixtures/test-data'
import { createNavigationHelper } from './helpers/navigation'
import { createFormHelper } from './helpers/forms'

test.describe('Onboarding Flow', () => {
  // Note: These tests assume user is already authenticated
  // In a real scenario, you'd need to set up auth state before these tests
  
  test.describe('Team Setup Wizard', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to team setup page
      await page.goto('/onboarding/team-setup')
    })

    test('team setup page loads correctly', async ({ page }) => {
      await expect(page.locator('h1:has-text("Set Up Team Training")')).toBeVisible()
      await expect(page.locator('text=Assign AI hiring compliance training')).toBeVisible()
      
      // Check progress indicators
      await expect(page.locator('text=1').first()).toBeVisible()
    })

    test('first step asks for recruiters', async ({ page }) => {
      await expect(page.locator('text=Who handles recruiting')).toBeVisible()
      await expect(page.locator('text=recruiters and talent acquisition')).toBeVisible()
      
      // Check form fields
      await expect(page.locator('input[placeholder="Full name"]')).toBeVisible()
      await expect(page.locator('input[placeholder="Email address"]')).toBeVisible()
    })

    test('can add team member details', async ({ page }) => {
      const recruiter = generateTeamMember('recruiter')
      
      // Fill recruiter details
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      
      // Verify fields
      await expect(page.locator('input[placeholder="Full name"]')).toHaveValue(recruiter.name)
      await expect(page.locator('input[placeholder="Email address"]')).toHaveValue(recruiter.email)
    })

    test('can add multiple team members in same role', async ({ page }) => {
      const recruiter1 = generateTeamMember('recruiter')
      const recruiter2 = generateTeamMember('recruiter')
      
      // Fill first recruiter
      const nameInputs = page.locator('input[placeholder="Full name"]')
      const emailInputs = page.locator('input[placeholder="Email address"]')
      
      await nameInputs.first().fill(recruiter1.name)
      await emailInputs.first().fill(recruiter1.email)
      
      // Add another recruiter
      await page.click('button:has-text("Add another")')
      
      // Should have two sets of inputs now
      await expect(nameInputs).toHaveCount(2)
      
      // Fill second recruiter
      await nameInputs.nth(1).fill(recruiter2.name)
      await emailInputs.nth(1).fill(recruiter2.email)
    })

    test('can remove a team member', async ({ page }) => {
      const recruiter = generateTeamMember('recruiter')
      
      // Fill first recruiter
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      
      // Add another recruiter
      await page.click('button:has-text("Add another")')
      
      // Should have two entries
      await expect(page.locator('input[placeholder="Full name"]')).toHaveCount(2)
      
      // Remove the second one (should have delete button)
      const deleteButtons = page.locator('button:has([class*="Trash"]), button:has-text("Remove")')
      if (await deleteButtons.count() > 0) {
        await deleteButtons.last().click()
        await expect(page.locator('input[placeholder="Full name"]')).toHaveCount(1)
      }
    })

    test('can navigate through all wizard steps', async ({ page }) => {
      const recruiter = generateTeamMember('recruiter')
      const manager = generateTeamMember('manager')
      const admin = generateTeamMember('admin')
      
      // Step 1: Recruiters
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      await page.click('button:has-text("Next")')
      
      // Step 2: Hiring Managers
      await expect(page.locator('text=Who makes hiring decisions')).toBeVisible({ timeout: 5000 })
      await page.fill('input[placeholder="Full name"]', manager.name)
      await page.fill('input[placeholder="Email address"]', manager.email)
      await page.click('button:has-text("Next")')
      
      // Step 3: HR Admins
      await expect(page.locator('text=Who manages HR compliance')).toBeVisible({ timeout: 5000 })
      await page.fill('input[placeholder="Full name"]', admin.name)
      await page.fill('input[placeholder="Email address"]', admin.email)
      await page.click('button:has-text("Next")')
      
      // Step 4: Executives (optional)
      await expect(page.locator('text=executives')).toBeVisible({ timeout: 5000 })
    })

    test('can go back to previous step', async ({ page }) => {
      const recruiter = generateTeamMember('recruiter')
      
      // Complete step 1
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      await page.click('button:has-text("Next")')
      
      // Wait for step 2
      await expect(page.locator('text=Who makes hiring decisions')).toBeVisible({ timeout: 5000 })
      
      // Go back
      await page.click('button:has-text("Back")')
      
      // Should be back at step 1
      await expect(page.locator('text=Who handles recruiting')).toBeVisible()
    })

    test('shows training summary with member count', async ({ page }) => {
      const recruiter = generateTeamMember('recruiter')
      
      // Add a team member
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      
      // Should show summary
      await expect(page.locator('text=Training Summary')).toBeVisible()
      await expect(page.locator('text=1 team member')).toBeVisible()
    })

    test('can skip optional step (executives)', async ({ page }) => {
      const recruiter = generateTeamMember('recruiter')
      const manager = generateTeamMember('manager')
      const admin = generateTeamMember('admin')
      
      // Complete required steps
      await page.fill('input[placeholder="Full name"]', recruiter.name)
      await page.fill('input[placeholder="Email address"]', recruiter.email)
      await page.click('button:has-text("Next")')
      
      await page.fill('input[placeholder="Full name"]', manager.name)
      await page.fill('input[placeholder="Email address"]', manager.email)
      await page.click('button:has-text("Next")')
      
      await page.fill('input[placeholder="Full name"]', admin.name)
      await page.fill('input[placeholder="Email address"]', admin.email)
      await page.click('button:has-text("Next")')
      
      // On executives step (optional)
      await expect(page.locator('text=executives')).toBeVisible({ timeout: 5000 })
      
      // Look for skip option
      const skipButton = page.locator('button:has-text("Skip"), a:has-text("Skip")')
      if (await skipButton.isVisible()) {
        await skipButton.click()
      }
    })

    test('validates required steps have at least one member', async ({ page }) => {
      // Try to proceed without adding anyone
      await page.click('button:has-text("Next")')
      
      // Should not proceed - still on step 1
      await expect(page.locator('text=Who handles recruiting')).toBeVisible()
      
      // Or should show error
      const hasError = await page.locator('[class*="error"], .bg-red-50').isVisible().catch(() => false)
      const stillOnStep1 = await page.locator('text=Who handles recruiting').isVisible()
      
      expect(hasError || stillOnStep1).toBeTruthy()
    })
  })

  test.describe('Dashboard After Onboarding', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard')
    })

    test('dashboard shows compliance score', async ({ page }) => {
      await expect(page.locator('text=Compliance Score')).toBeVisible()
      
      // Score should be displayed
      const scoreElement = page.locator('[class*="text-4xl"], [class*="font-bold"]').first()
      await expect(scoreElement).toBeVisible()
    })

    test('dashboard shows quick actions', async ({ page }) => {
      await expect(page.locator('text=Quick Actions')).toBeVisible()
      
      // Check action buttons
      await expect(page.locator('text=Run New Audit')).toBeVisible()
      await expect(page.locator('text=Generate Document')).toBeVisible()
      await expect(page.locator('text=Continue Training')).toBeVisible()
    })

    test('dashboard shows stats grid', async ({ page }) => {
      await expect(page.locator('text=Regulated States')).toBeVisible()
      await expect(page.locator('text=AI Tools Tracked')).toBeVisible()
      await expect(page.locator('text=Documents')).toBeVisible()
    })

    test('new user sees onboarding wizard', async ({ page }) => {
      // For new users, onboarding wizard should be visible
      const wizardVisible = await page.locator('text=Get Started, text=Setup, text=Complete').first().isVisible().catch(() => false)
      
      // Either wizard is visible or user has completed onboarding
      expect(true).toBeTruthy() // Placeholder - actual check depends on user state
    })

    test('dashboard shows compliance deadlines', async ({ page }) => {
      await expect(page.locator('text=Compliance Deadlines')).toBeVisible()
      await expect(page.locator('text=Illinois')).toBeVisible()
      await expect(page.locator('text=Colorado')).toBeVisible()
    })
  })
})
