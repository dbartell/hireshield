import { Page, Locator, expect } from '@playwright/test'

/**
 * Form helpers for HireShield E2E tests
 */

export class FormHelper {
  constructor(private page: Page) {}

  /**
   * Fill a text input by label or placeholder
   */
  async fillInput(labelOrPlaceholder: string, value: string) {
    // Try by label first
    let input = this.page.locator(`label:has-text("${labelOrPlaceholder}") + input, label:has-text("${labelOrPlaceholder}") input`)
    
    if (!(await input.isVisible().catch(() => false))) {
      // Try by placeholder
      input = this.page.locator(`input[placeholder*="${labelOrPlaceholder}"]`)
    }
    
    if (!(await input.isVisible().catch(() => false))) {
      // Try by id containing the text
      input = this.page.locator(`input[id*="${labelOrPlaceholder.toLowerCase()}"]`)
    }

    await input.fill(value)
  }

  /**
   * Fill a textarea by label
   */
  async fillTextarea(label: string, value: string) {
    const textarea = this.page.locator(`label:has-text("${label}") + textarea, label:has-text("${label}") textarea, textarea[placeholder*="${label}"]`)
    await textarea.fill(value)
  }

  /**
   * Click a button by text
   */
  async clickButton(buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`)
  }

  /**
   * Click a link by text
   */
  async clickLink(linkText: string) {
    await this.page.click(`a:has-text("${linkText}")`)
  }

  /**
   * Select from dropdown by label and option text
   */
  async selectOption(label: string, optionText: string) {
    const select = this.page.locator(`label:has-text("${label}") + select, label:has-text("${label}") select`)
    await select.selectOption({ label: optionText })
  }

  /**
   * Toggle a checkbox
   */
  async toggleCheckbox(label: string, checked: boolean) {
    const checkbox = this.page.locator(`label:has-text("${label}") input[type="checkbox"], input[type="checkbox"] + label:has-text("${label}")`)
    const isChecked = await checkbox.isChecked()
    if (isChecked !== checked) {
      await checkbox.click()
    }
  }

  /**
   * Click a radio button
   */
  async selectRadio(label: string) {
    await this.page.click(`label:has-text("${label}")`)
  }

  /**
   * Upload a file
   */
  async uploadFile(inputSelector: string, filePath: string) {
    const input = this.page.locator(inputSelector)
    await input.setInputFiles(filePath)
  }

  /**
   * Fill a date input
   */
  async fillDate(label: string, date: string) {
    // date should be in YYYY-MM-DD format
    const input = this.page.locator(`label:has-text("${label}") + input[type="date"], input[type="date"][placeholder*="${label}"]`)
    await input.fill(date)
  }

  /**
   * Fill a color input
   */
  async fillColor(label: string, color: string) {
    // color should be in #RRGGBB format
    const input = this.page.locator(`label:has-text("${label}") input[type="color"], label:has-text("${label}") + div input[type="text"]`)
    await input.fill(color)
  }

  /**
   * Wait for form submission to complete
   */
  async waitForFormSubmission(options?: { timeout?: number }) {
    // Wait for loading state to disappear
    await this.page.waitForSelector('button:has-text("Loading"), button:has-text("Saving"), [class*="animate-spin"]', {
      state: 'hidden',
      timeout: options?.timeout || 10000,
    }).catch(() => {})
    
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Check for form error message
   */
  async hasError(errorText?: string): Promise<boolean> {
    if (errorText) {
      return this.page.locator(`text=${errorText}`).isVisible()
    }
    return this.page.locator('[class*="error"], [class*="red"], .bg-red-50').isVisible()
  }

  /**
   * Check for success message
   */
  async hasSuccess(successText?: string): Promise<boolean> {
    if (successText) {
      return this.page.locator(`text=${successText}`).isVisible()
    }
    return this.page.locator('[class*="success"], [class*="green"], .bg-green-50').isVisible()
  }

  /**
   * Fill multiple inputs at once
   */
  async fillForm(fields: Record<string, string>) {
    for (const [label, value] of Object.entries(fields)) {
      await this.fillInput(label, value)
    }
  }
}

/**
 * Create form helper
 */
export function createFormHelper(page: Page) {
  return new FormHelper(page)
}
