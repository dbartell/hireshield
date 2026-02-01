import { Page, expect } from '@playwright/test'

/**
 * Navigation helpers for HireShield E2E tests
 */

export class NavigationHelper {
  constructor(private page: Page) {}

  /**
   * Navigate to dashboard
   */
  async goToDashboard() {
    await this.page.goto('/dashboard')
    await expect(this.page.locator('h1:has-text("Dashboard")')).toBeVisible()
  }

  /**
   * Navigate to documents page
   */
  async goToDocuments() {
    await this.page.goto('/documents')
    await expect(this.page.locator('h1:has-text("Documents")')).toBeVisible()
  }

  /**
   * Navigate to training page
   */
  async goToTraining() {
    await this.page.goto('/training')
    await expect(this.page.locator('h1:has-text("Training"), h1:has-text("My Training")')).toBeVisible()
  }

  /**
   * Navigate to compliance documents
   */
  async goToComplianceDocuments() {
    await this.page.goto('/compliance/documents')
    await expect(this.page.locator('h1:has-text("Compliance Documents")')).toBeVisible()
  }

  /**
   * Navigate to team settings
   */
  async goToTeamSettings() {
    await this.page.goto('/settings/team')
    await expect(this.page.locator('h1:has-text("Team")')).toBeVisible()
  }

  /**
   * Navigate to integrations
   */
  async goToIntegrations() {
    await this.page.goto('/settings/integrations')
    await expect(this.page.locator('h1:has-text("ATS Integrations"), h1:has-text("Integrations")')).toBeVisible()
  }

  /**
   * Navigate to disclosure settings
   */
  async goToDisclosureSettings() {
    await this.page.goto('/settings/disclosure')
    await expect(this.page.locator('h1:has-text("Disclosure")')).toBeVisible()
  }

  /**
   * Navigate to audit page
   */
  async goToAudit() {
    await this.page.goto('/audit')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Navigate to onboarding team setup
   */
  async goToTeamSetup() {
    await this.page.goto('/onboarding/team-setup')
    await expect(this.page.locator('h1:has-text("Set Up Team Training")')).toBeVisible()
  }

  /**
   * Navigate to public disclosure page
   */
  async goToPublicDisclosure(slug: string) {
    await this.page.goto(`/d/${slug}`)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Navigate to homepage
   */
  async goToHomepage() {
    await this.page.goto('/')
    await expect(this.page.locator('text=AI Hiring Compliance')).toBeVisible()
  }

  /**
   * Navigate to pricing page
   */
  async goToPricing() {
    await this.page.goto('/pricing')
    await expect(this.page.locator('text=Simple, Transparent Pricing')).toBeVisible()
  }

  /**
   * Navigate using sidebar menu
   */
  async clickSidebarLink(linkText: string) {
    await this.page.click(`nav a:has-text("${linkText}")`)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Navigate using header menu
   */
  async clickHeaderLink(linkText: string) {
    await this.page.click(`header a:has-text("${linkText}")`)
    await this.page.waitForLoadState('networkidle')
  }
}

/**
 * Create navigation helper
 */
export function createNavigationHelper(page: Page) {
  return new NavigationHelper(page)
}
