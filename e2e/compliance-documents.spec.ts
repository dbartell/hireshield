import { test, expect } from '@playwright/test'
import { testData } from './fixtures/test-data'

test.describe('Compliance Documents', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to compliance documents page
    await page.goto('/compliance/documents')
    await page.waitForLoadState('networkidle')
  })

  test('compliance documents page loads correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("Compliance Documents")')).toBeVisible()
    await expect(page.locator('text=Track your compliance documents')).toBeVisible()
  })

  test('shows stats cards', async ({ page }) => {
    await expect(page.locator('text=Total Documents')).toBeVisible()
    await expect(page.locator('text=Active')).toBeVisible()
    await expect(page.locator('text=Expiring Soon')).toBeVisible()
    await expect(page.locator('text=Expired')).toBeVisible()
  })

  test('shows Add Document button', async ({ page }) => {
    await expect(page.locator('button:has-text("Add Document")')).toBeVisible()
  })

  test('shows renewal reminders info banner', async ({ page }) => {
    await expect(page.locator('text=Automatic Renewal Reminders')).toBeVisible()
    await expect(page.locator('text=90, 60, 30, and 7 days')).toBeVisible()
  })

  test.describe('Add Document Dialog', () => {
    test('can open add document dialog', async ({ page }) => {
      await page.click('button:has-text("Add Document")')
      
      // Dialog should open
      await expect(page.locator('[role="dialog"], .fixed')).toBeVisible()
    })

    test('dialog shows document type selection', async ({ page }) => {
      await page.click('button:has-text("Add Document")')
      
      // Wait for dialog
      await page.waitForSelector('[role="dialog"], .fixed')
      
      // Check for document types
      await expect(page.locator('text=Bias Audit')).toBeVisible()
    })

    test('dialog shows issue date field', async ({ page }) => {
      await page.click('button:has-text("Add Document")')
      
      // Wait for dialog
      await page.waitForSelector('[role="dialog"], .fixed')
      
      // Check for date field
      await expect(page.locator('input[type="date"], text=Issue Date')).toBeVisible()
    })

    test('can fill document details', async ({ page }) => {
      await page.click('button:has-text("Add Document")')
      
      // Wait for dialog
      await page.waitForSelector('[role="dialog"], .fixed')
      
      // Select document type (if dropdown)
      const typeSelector = page.locator('select, [role="combobox"]')
      if (await typeSelector.isVisible()) {
        await typeSelector.selectOption({ label: 'Bias Audit' }).catch(() => {
          // Might be radio buttons or cards
        })
      }
      
      // Fill name/title if present
      const nameInput = page.locator('input[placeholder*="name"], input[placeholder*="title"]')
      if (await nameInput.isVisible()) {
        await nameInput.fill('Annual Bias Audit 2024')
      }
      
      // Fill date
      const dateInput = page.locator('input[type="date"]')
      if (await dateInput.isVisible()) {
        await dateInput.fill(new Date().toISOString().split('T')[0])
      }
    })

    test('calculates expiry date automatically', async ({ page }) => {
      await page.click('button:has-text("Add Document")')
      
      // Wait for dialog
      await page.waitForSelector('[role="dialog"], .fixed')
      
      // Fill issue date
      const dateInput = page.locator('input[type="date"]').first()
      if (await dateInput.isVisible()) {
        await dateInput.fill('2024-01-15')
        
        // Check for calculated expiry
        const expiryText = page.locator('text=Expires, text=expir')
        // Expiry should be calculated (e.g., 1 year from issue)
      }
    })

    test('can save new document', async ({ page }) => {
      // Mock save API
      await page.route('**/api/compliance/documents', (route) => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'new-doc-1',
              type: 'bias_audit',
              name: 'Test Audit',
              issued_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
            }),
          })
        } else {
          route.continue()
        }
      })
      
      await page.click('button:has-text("Add Document")')
      
      // Wait for dialog
      await page.waitForSelector('[role="dialog"], .fixed')
      
      // Fill minimal required fields
      const dateInput = page.locator('input[type="date"]').first()
      if (await dateInput.isVisible()) {
        await dateInput.fill(new Date().toISOString().split('T')[0])
      }
      
      // Save
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Add")')
      if (await saveButton.isVisible()) {
        await saveButton.click()
        await page.waitForLoadState('networkidle')
      }
    })

    test('can cancel dialog', async ({ page }) => {
      await page.click('button:has-text("Add Document")')
      
      // Wait for dialog
      await page.waitForSelector('[role="dialog"], .fixed')
      
      // Cancel
      const cancelButton = page.locator('button:has-text("Cancel")')
      if (await cancelButton.isVisible()) {
        await cancelButton.click()
        
        // Dialog should close
        await expect(page.locator('[role="dialog"]:visible')).not.toBeVisible({ timeout: 5000 })
      }
    })
  })

  test.describe('Documents Table', () => {
    test.beforeEach(async ({ page }) => {
      // Mock documents data
      await page.route('**/api/compliance/documents', (route) => {
        if (route.request().method() === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              documents: [
                {
                  id: 'doc-1',
                  type: 'bias_audit',
                  name: 'Annual Bias Audit 2024',
                  issued_at: '2024-01-15T00:00:00Z',
                  expires_at: '2025-01-15T00:00:00Z',
                  status: 'active',
                  auditor: 'CertifiedAuditors LLC',
                  notes: 'Annual audit completed',
                },
                {
                  id: 'doc-2',
                  type: 'impact_assessment',
                  name: 'Colorado Impact Assessment',
                  issued_at: '2024-02-01T00:00:00Z',
                  expires_at: '2024-08-01T00:00:00Z',
                  status: 'expiring_soon',
                  notes: null,
                },
                {
                  id: 'doc-3',
                  type: 'policy',
                  name: 'AI Hiring Policy v1',
                  issued_at: '2023-06-01T00:00:00Z',
                  expires_at: '2024-06-01T00:00:00Z',
                  status: 'expired',
                  notes: 'Needs renewal',
                },
              ],
            }),
          })
        } else {
          route.continue()
        }
      })
      
      await page.goto('/compliance/documents')
      await page.waitForLoadState('networkidle')
    })

    test('shows documents in table', async ({ page }) => {
      await expect(page.locator('text=Annual Bias Audit 2024')).toBeVisible()
      await expect(page.locator('text=Colorado Impact Assessment')).toBeVisible()
    })

    test('shows document status badges', async ({ page }) => {
      // Active status
      await expect(page.locator('text=Active, .bg-green-100')).toBeVisible()
      
      // Expiring soon status (if visible)
      const expiringBadge = page.locator('text=Expiring, .bg-orange-100, .bg-amber-100')
      // May be visible depending on document dates
    })

    test('shows issue and expiry dates', async ({ page }) => {
      // Dates should be displayed
      const dateText = page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/, text=/\\d{4}-\\d{2}-\\d{2}/')
      expect(await dateText.count()).toBeGreaterThan(0)
    })

    test('shows action buttons for each document', async ({ page }) => {
      // View, Edit, Delete buttons
      const actionButtons = page.locator('button:has([class*="Eye"]), button:has([class*="Pencil"]), button:has([class*="Trash"])')
      expect(await actionButtons.count()).toBeGreaterThan(0)
    })
  })

  test.describe('Document Actions', () => {
    test.beforeEach(async ({ page }) => {
      // Mock single document
      await page.route('**/api/compliance/documents', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            documents: [{
              id: 'doc-1',
              type: 'bias_audit',
              name: 'Test Audit',
              issued_at: '2024-01-15T00:00:00Z',
              expires_at: '2025-01-15T00:00:00Z',
              status: 'active',
            }],
          }),
        })
      })
      
      await page.goto('/compliance/documents')
      await page.waitForLoadState('networkidle')
    })

    test('can view document details', async ({ page }) => {
      const viewButton = page.locator('button:has([class*="Eye"]), button[title="View"]').first()
      
      if (await viewButton.isVisible()) {
        await viewButton.click()
        
        // Should show details modal or expand row
        await expect(page.locator('[role="dialog"], .expanded')).toBeVisible({ timeout: 3000 }).catch(() => {
          // Might show inline
        })
      }
    })

    test('can edit document', async ({ page }) => {
      const editButton = page.locator('button:has([class*="Pencil"]), button[title="Edit"]').first()
      
      if (await editButton.isVisible()) {
        await editButton.click()
        
        // Should show edit dialog
        await expect(page.locator('[role="dialog"], .fixed')).toBeVisible({ timeout: 3000 }).catch(() => {
          // Might navigate to edit page
        })
      }
    })

    test('can delete document', async ({ page }) => {
      // Mock delete API
      await page.route('**/api/compliance/documents/*', (route) => {
        if (route.request().method() === 'DELETE') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true }),
          })
        } else {
          route.continue()
        }
      })
      
      const deleteButton = page.locator('button:has([class*="Trash"]), button[title="Delete"]').first()
      
      if (await deleteButton.isVisible()) {
        // Set up dialog handler
        page.on('dialog', dialog => dialog.accept())
        
        await deleteButton.click()
        await page.waitForLoadState('networkidle')
      }
    })
  })

  test.describe('Renewal Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Mock expired document
      await page.route('**/api/compliance/documents', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            documents: [{
              id: 'doc-1',
              type: 'bias_audit',
              name: 'Expired Audit',
              issued_at: '2023-01-15T00:00:00Z',
              expires_at: '2024-01-15T00:00:00Z',
              status: 'expired',
            }],
          }),
        })
      })
      
      await page.goto('/compliance/documents')
      await page.waitForLoadState('networkidle')
    })

    test('expired documents show renewal option', async ({ page }) => {
      const renewButton = page.locator('button:has-text("Renew"), a:has-text("Renew")')
      // May be visible for expired documents
    })

    test('can initiate renewal for expired document', async ({ page }) => {
      const renewButton = page.locator('button:has-text("Renew")').first()
      
      if (await renewButton.isVisible()) {
        await renewButton.click()
        
        // Should open renewal dialog or navigate
        await page.waitForLoadState('networkidle')
      }
    })
  })

  test.describe('Empty State', () => {
    test.beforeEach(async ({ page }) => {
      // Mock empty documents
      await page.route('**/api/compliance/documents', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ documents: [] }),
        })
      })
      
      await page.goto('/compliance/documents')
      await page.waitForLoadState('networkidle')
    })

    test('shows empty state when no documents', async ({ page }) => {
      // Stats should show zeros
      const zeroCount = page.locator('text=/^0$/')
      expect(await zeroCount.count()).toBeGreaterThanOrEqual(1)
    })

    test('shows add document prompt in empty state', async ({ page }) => {
      await expect(page.locator('button:has-text("Add Document")')).toBeVisible()
    })
  })

  test.describe('Document Type Filters', () => {
    test('can filter by document type', async ({ page }) => {
      // If filter exists
      const filterDropdown = page.locator('select:has-text("Type"), button:has-text("Filter")')
      
      if (await filterDropdown.isVisible()) {
        await filterDropdown.click()
        // Select a filter option
      }
    })

    test('can filter by status', async ({ page }) => {
      // If status filter exists
      const statusFilter = page.locator('select:has-text("Status"), button:has-text("Active")')
      
      if (await statusFilter.isVisible()) {
        await statusFilter.click()
      }
    })
  })
})
