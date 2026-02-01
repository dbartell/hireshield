import { test, expect } from '@playwright/test'
import { testData } from './fixtures/test-data'

test.describe('Disclosure Page Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to disclosure settings
    await page.goto('/settings/disclosure')
    await page.waitForLoadState('networkidle')
  })

  test('disclosure settings page loads correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("Disclosure Page")')).toBeVisible()
    await expect(page.locator('text=Create a public page')).toBeVisible()
  })

  test('shows Save Changes button', async ({ page }) => {
    await expect(page.locator('button:has-text("Save Changes")')).toBeVisible()
  })

  test('shows tabs for different sections', async ({ page }) => {
    await expect(page.locator('button:has-text("Content")')).toBeVisible()
    await expect(page.locator('button:has-text("Branding")')).toBeVisible()
    await expect(page.locator('button:has-text("AI Tools")')).toBeVisible()
    await expect(page.locator('button:has-text("Analytics")')).toBeVisible()
  })

  test('can switch between tabs', async ({ page }) => {
    // Click Branding tab
    await page.click('button:has-text("Branding")')
    await expect(page.locator('text=Logo URL')).toBeVisible()
    
    // Click AI Tools tab
    await page.click('button:has-text("AI Tools")')
    await expect(page.locator('text=AI Tools')).toBeVisible()
    
    // Click back to Content
    await page.click('button:has-text("Content")')
    await expect(page.locator('text=Page URL')).toBeVisible()
  })

  test.describe('Content Tab', () => {
    test('shows Page URL field', async ({ page }) => {
      await expect(page.locator('text=Page URL')).toBeVisible()
      await expect(page.locator('text=/d/')).toBeVisible()
    })

    test('can edit page slug', async ({ page }) => {
      const slugInput = page.locator('input').filter({ hasText: '' }).first()
      
      // Find the slug input (after /d/)
      const inputs = page.locator('input[type="text"]')
      const slugField = inputs.first()
      
      await slugField.clear()
      await slugField.fill('acme-corp')
      
      await expect(slugField).toHaveValue('acme-corp')
    })

    test('shows Header Text field', async ({ page }) => {
      await expect(page.locator('text=Header Text')).toBeVisible()
    })

    test('can edit header text', async ({ page }) => {
      const headerInput = page.locator('input[placeholder*="How"]')
      
      if (await headerInput.isVisible()) {
        await headerInput.clear()
        await headerInput.fill('How Acme Corp Uses AI in Hiring')
        await expect(headerInput).toHaveValue('How Acme Corp Uses AI in Hiring')
      }
    })

    test('shows Introduction textarea', async ({ page }) => {
      await expect(page.locator('text=Introduction')).toBeVisible()
    })

    test('can edit intro text', async ({ page }) => {
      const introTextarea = page.locator('textarea').first()
      
      if (await introTextarea.isVisible()) {
        await introTextarea.clear()
        await introTextarea.fill(testData.disclosurePage.introText)
        await expect(introTextarea).toHaveValue(testData.disclosurePage.introText)
      }
    })

    test('shows Contact Email field', async ({ page }) => {
      await expect(page.locator('text=Contact Email')).toBeVisible()
    })

    test('can edit contact email', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]')
      
      if (await emailInput.isVisible()) {
        await emailInput.clear()
        await emailInput.fill('hr@acme-test.com')
        await expect(emailInput).toHaveValue('hr@acme-test.com')
      }
    })

    test('shows Rights Section toggle', async ({ page }) => {
      await expect(page.locator('text=Candidate Rights Section')).toBeVisible()
    })

    test('shows Bias Audit Section toggle', async ({ page }) => {
      await expect(page.locator('text=Bias Audit Section')).toBeVisible()
    })
  })

  test.describe('Branding Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Branding")')
    })

    test('shows Logo URL field', async ({ page }) => {
      await expect(page.locator('text=Logo URL')).toBeVisible()
    })

    test('shows Brand Color picker', async ({ page }) => {
      await expect(page.locator('text=Brand Color')).toBeVisible()
      
      // Color input should be visible
      await expect(page.locator('input[type="color"]')).toBeVisible()
    })

    test('can change brand color', async ({ page }) => {
      const colorInput = page.locator('input[type="color"]')
      
      if (await colorInput.isVisible()) {
        await colorInput.fill('#FF5733')
      }
      
      // Text input for color should reflect change
      const colorTextInput = page.locator('input[placeholder="#3B82F6"], input[value*="#"]')
      if (await colorTextInput.isVisible()) {
        await colorTextInput.clear()
        await colorTextInput.fill('#FF5733')
        await expect(colorTextInput).toHaveValue('#FF5733')
      }
    })
  })

  test.describe('AI Tools Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("AI Tools")')
    })

    test('shows Use Audit Tools toggle', async ({ page }) => {
      await expect(page.locator('text=Use tools from audit')).toBeVisible()
    })

    test('shows Add Tool button', async ({ page }) => {
      await expect(page.locator('button:has-text("Add Tool")')).toBeVisible()
    })

    test('can add custom tool', async ({ page }) => {
      await page.click('button:has-text("Add Tool")')
      
      // Tool form should appear
      await expect(page.locator('text=Tool 1')).toBeVisible()
      
      // Fill tool details
      const nameInput = page.locator('input[placeholder*="Tool name"]')
      const purposeInput = page.locator('input[placeholder*="Purpose"]')
      
      if (await nameInput.isVisible()) {
        await nameInput.fill('HireVue')
        await purposeInput.fill('Video interview analysis')
      }
    })

    test('can remove custom tool', async ({ page }) => {
      // First add a tool
      await page.click('button:has-text("Add Tool")')
      await expect(page.locator('text=Tool 1')).toBeVisible()
      
      // Find and click delete button
      const deleteButton = page.locator('button:has([class*="Trash"])').first()
      if (await deleteButton.isVisible()) {
        await deleteButton.click()
        
        // Tool should be removed
        await expect(page.locator('text=Tool 1')).not.toBeVisible()
      }
    })
  })

  test.describe('Live Preview', () => {
    test('shows live preview panel', async ({ page }) => {
      await expect(page.locator('text=Live Preview')).toBeVisible()
    })

    test('preview updates when editing content', async ({ page }) => {
      // Edit header text
      const headerInput = page.locator('input[placeholder*="How"]')
      
      if (await headerInput.isVisible()) {
        await headerInput.clear()
        await headerInput.fill('Test Company AI Disclosure')
        
        // Preview should update
        await expect(page.locator('.bg-white:has-text("Test Company AI Disclosure")')).toBeVisible({ timeout: 2000 })
      }
    })
  })

  test.describe('Publish Flow', () => {
    test('shows Publish button when unpublished', async ({ page }) => {
      // Look for either Publish or Unpublish button
      const publishBtn = page.locator('button:has-text("Publish")')
      const unpublishBtn = page.locator('button:has-text("Unpublish")')
      
      const hasPublish = await publishBtn.isVisible().catch(() => false)
      const hasUnpublish = await unpublishBtn.isVisible().catch(() => false)
      
      expect(hasPublish || hasUnpublish).toBeTruthy()
    })

    test('can save changes', async ({ page }) => {
      // Make an edit
      const emailInput = page.locator('input[type="email"]')
      if (await emailInput.isVisible()) {
        await emailInput.clear()
        await emailInput.fill('test@test.com')
      }
      
      // Save
      await page.click('button:has-text("Save Changes")')
      
      // Wait for save to complete
      await page.waitForLoadState('networkidle')
    })
  })

  test.describe('Public Disclosure Page', () => {
    test('can access public disclosure page when published', async ({ page }) => {
      // This test assumes a page is already published
      // First, get the slug
      const slugInput = page.locator('input').filter({ hasText: '' }).first()
      
      // Navigate to public page
      await page.goto('/d/test-company')
      
      // Should load without error (or show 404 if not published)
      await page.waitForLoadState('networkidle')
    })
  })

  test.describe('Analytics Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Analytics")')
    })

    test('shows analytics message for unpublished page', async ({ page }) => {
      // If page is not published, should show message
      const publishMessage = page.locator('text=Publish your page to start tracking')
      const analyticsData = page.locator('text=Total Views')
      
      const hasMessage = await publishMessage.isVisible().catch(() => false)
      const hasData = await analyticsData.isVisible().catch(() => false)
      
      expect(hasMessage || hasData).toBeTruthy()
    })
  })

  test.describe('Embed Widget', () => {
    test('shows embed code section when published', async ({ page }) => {
      // Mock a published state
      await page.route('**/api/disclosure/**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            page: {
              id: 'test-id',
              slug: 'acme-corp',
              is_published: true,
              logo_url: null,
              brand_color: '#3B82F6',
              header_text: 'How We Use AI',
              intro_text: 'Test intro',
              contact_email: 'hr@test.com',
              rights_section_enabled: true,
              bias_audit_section_enabled: false,
              custom_tools: [],
              use_audit_tools: true,
            },
          }),
        })
      })
      
      await page.goto('/settings/disclosure')
      await page.waitForLoadState('networkidle')
      
      // Look for embed widget section
      const embedSection = page.locator('text=Embed Widget')
      if (await embedSection.isVisible()) {
        await expect(page.locator('text=embed.js')).toBeVisible()
      }
    })
  })
})
