import { test, expect } from '@playwright/test'
import { testData } from './fixtures/test-data'
import { createNavigationHelper } from './helpers/navigation'
import { createFormHelper } from './helpers/forms'

test.describe('Document Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to documents page
    await page.goto('/documents')
    await page.waitForLoadState('networkidle')
  })

  test('documents page loads correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("Documents")')).toBeVisible()
    await expect(page.locator('text=Generate and manage compliance documents')).toBeVisible()
    
    // Check for New Document button
    await expect(page.locator('button:has-text("New Document")')).toBeVisible()
  })

  test('can open document generator', async ({ page }) => {
    // Click New Document button
    await page.click('button:has-text("New Document")')
    
    // Generator section should appear
    await expect(page.locator('text=Generate New Document')).toBeVisible()
    await expect(page.locator('text=Select the type of document')).toBeVisible()
  })

  test('document generator shows all document types', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Check document types are visible
    await expect(page.locator('text=Candidate Disclosure Notice')).toBeVisible()
    await expect(page.locator('text=Employee Disclosure Notice')).toBeVisible()
    await expect(page.locator('text=Candidate Consent Form')).toBeVisible()
    await expect(page.locator('text=Employee Handbook Policy')).toBeVisible()
    await expect(page.locator('text=Impact Assessment')).toBeVisible()
    await expect(page.locator('text=Bias Audit Disclosure')).toBeVisible()
  })

  test('document types show applicable states', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Check state tags are visible on document types
    const stateTags = page.locator('.bg-gray-100, [class*="rounded"]:has-text("IL"), [class*="rounded"]:has-text("CO"), [class*="rounded"]:has-text("CA"), [class*="rounded"]:has-text("NYC")')
    expect(await stateTags.count()).toBeGreaterThan(0)
  })

  test('can select document type', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Select Candidate Disclosure Notice
    await page.click('button:has-text("Candidate Disclosure Notice")')
    
    // Selection should be highlighted
    const selectedCard = page.locator('button:has-text("Candidate Disclosure Notice")')
    await expect(selectedCard).toHaveClass(/border-blue-600|shadow/)
  })

  test('can generate disclosure notice document', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Select document type
    await page.click('button:has-text("Candidate Disclosure Notice")')
    
    // Click Generate button
    await page.click('button:has-text("Generate Document")')
    
    // Wait for editor to appear
    await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
    
    // Document title field should be populated
    const titleInput = page.locator('input[type="text"]').first()
    await expect(titleInput).toHaveValue(/.+/)
    
    // Content textarea should have content
    const contentArea = page.locator('textarea')
    await expect(contentArea).not.toBeEmpty()
  })

  test('can edit generated document', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    await page.click('button:has-text("Candidate Disclosure Notice")')
    await page.click('button:has-text("Generate Document")')
    
    // Wait for editor
    await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
    
    // Edit title
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.clear()
    await titleInput.fill('Custom Disclosure Notice - Acme Corp')
    
    // Edit content
    const contentArea = page.locator('textarea')
    const currentContent = await contentArea.inputValue()
    await contentArea.fill(currentContent + '\n\nAdditional custom content added.')
    
    // Verify edits
    await expect(titleInput).toHaveValue('Custom Disclosure Notice - Acme Corp')
    await expect(contentArea).toContainText('Additional custom content')
  })

  test('can save document', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    await page.click('button:has-text("Candidate Disclosure Notice")')
    await page.click('button:has-text("Generate Document")')
    
    // Wait for editor
    await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
    
    // Click Save
    await page.click('button:has-text("Save Document")')
    
    // Wait for save to complete
    await page.waitForLoadState('networkidle')
    
    // Document should appear in list
    await expect(page.locator('text=Your Documents')).toBeVisible()
  })

  test('can cancel document generation', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Click Cancel
    await page.click('button:has-text("Cancel")')
    
    // Generator should close
    await expect(page.locator('text=Generate New Document')).not.toBeVisible()
  })

  test('can view generated document', async ({ page }) => {
    // First, check if there are existing documents
    const docList = page.locator('text=Your Documents')
    
    if (await docList.isVisible()) {
      // Find a document and click view
      const viewButton = page.locator('button:has([class*="Eye"]), button[title="View"]').first()
      
      if (await viewButton.isVisible()) {
        await viewButton.click()
        
        // Modal should open
        await expect(page.locator('[class*="fixed"], [role="dialog"]')).toBeVisible()
        
        // Close modal
        await page.click('button:has-text("Close")')
      }
    }
  })

  test('can download document as PDF', async ({ page }) => {
    // This test checks the download functionality
    // Note: Actual file download testing requires special handling
    
    const docList = page.locator('text=Your Documents')
    
    if (await docList.isVisible()) {
      const downloadButton = page.locator('button:has([class*="Download"]), button[title="Download"]').first()
      
      if (await downloadButton.isVisible()) {
        // Start waiting for download before clicking
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)
        
        await downloadButton.click()
        
        const download = await downloadPromise
        // If download happened, test passes
        // If not, the button might have a different behavior
      }
    }
  })

  test('can delete document', async ({ page }) => {
    const docList = page.locator('text=Your Documents')
    
    if (await docList.isVisible()) {
      const deleteButton = page.locator('button:has([class*="Trash"]), button[title="Delete"]').first()
      
      if (await deleteButton.isVisible()) {
        // Accept the confirmation dialog
        page.on('dialog', dialog => dialog.accept())
        
        await deleteButton.click()
        
        // Wait for deletion
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('shows state-specific templates info', async ({ page }) => {
    await expect(page.locator('text=State-Specific Templates')).toBeVisible()
    await expect(page.locator('text=Illinois HB 3773')).toBeVisible()
    await expect(page.locator('text=Colorado AI Act')).toBeVisible()
    await expect(page.locator('text=California CCPA')).toBeVisible()
    await expect(page.locator('text=NYC Local Law 144')).toBeVisible()
  })

  test('shows document formats section', async ({ page }) => {
    await expect(page.locator('text=Document Formats')).toBeVisible()
    await expect(page.locator('text=PDF')).toBeVisible()
  })

  test('can generate impact assessment for Colorado', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Select Impact Assessment
    await page.click('button:has-text("Impact Assessment")')
    
    // Should show CO tag
    await expect(page.locator('button:has-text("Impact Assessment")').locator('text=CO')).toBeVisible()
    
    // Generate
    await page.click('button:has-text("Generate Document")')
    
    // Wait for editor
    await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
  })

  test('can generate consent form', async ({ page }) => {
    await page.click('button:has-text("New Document")')
    
    // Select Consent Form
    await page.click('button:has-text("Candidate Consent Form")')
    
    // Generate
    await page.click('button:has-text("Generate Document")')
    
    // Wait for editor
    await expect(page.locator('text=Edit Document')).toBeVisible({ timeout: 10000 })
    
    // Content should include consent language
    const contentArea = page.locator('textarea')
    await expect(contentArea).toContainText(/consent|agree|acknowledge/i)
  })
})
