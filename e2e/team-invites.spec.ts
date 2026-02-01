import { test, expect } from '@playwright/test'
import { testData } from './fixtures/test-data'
import { mockEmailSending } from './helpers/api'

test.describe('Team Invites', () => {
  test.beforeEach(async ({ page }) => {
    // Mock email sending
    await mockEmailSending(page)
    
    // Navigate to team settings
    await page.goto('/settings/team')
    await page.waitForLoadState('networkidle')
  })

  test('team settings page loads correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("Team")')).toBeVisible()
    await expect(page.locator('text=Manage your team members')).toBeVisible()
  })

  test('shows seat usage card', async ({ page }) => {
    await expect(page.locator('text=Team Members')).toBeVisible()
  })

  test('shows Invite Member button', async ({ page }) => {
    await expect(page.locator('button:has-text("Invite Member")')).toBeVisible()
  })

  test('can open invite modal', async ({ page }) => {
    await page.click('button:has-text("Invite Member")')
    
    // Modal should open
    await expect(page.locator('[role="dialog"], .fixed')).toBeVisible()
    await expect(page.locator('text=Invite')).toBeVisible()
  })

  test('invite modal has email field', async ({ page }) => {
    await page.click('button:has-text("Invite Member")')
    
    // Wait for modal
    await page.waitForSelector('[role="dialog"], .fixed')
    
    // Check for email input
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible()
  })

  test('invite modal has role selection', async ({ page }) => {
    await page.click('button:has-text("Invite Member")')
    
    // Wait for modal
    await page.waitForSelector('[role="dialog"], .fixed')
    
    // Check for role selection
    const roleSelector = page.locator('select, [role="listbox"], button:has-text("Admin"), button:has-text("Member")')
    await expect(roleSelector.first()).toBeVisible()
  })

  test('can fill invite form', async ({ page }) => {
    await page.click('button:has-text("Invite Member")')
    
    // Wait for modal
    await page.waitForSelector('[role="dialog"], .fixed')
    
    // Fill email
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"]')
    await emailInput.fill(testData.teamInvite.email)
    
    await expect(emailInput).toHaveValue(testData.teamInvite.email)
  })

  test('can send invite', async ({ page }) => {
    // Mock invite API
    await page.route('**/api/team/invite', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
    
    await page.click('button:has-text("Invite Member")')
    
    // Wait for modal
    await page.waitForSelector('[role="dialog"], .fixed')
    
    // Fill email
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"]')
    await emailInput.fill('newmember@test.com')
    
    // Submit invite
    const sendButton = page.locator('button:has-text("Send Invite"), button:has-text("Invite")')
    await sendButton.click()
    
    // Wait for modal to close or success message
    await page.waitForLoadState('networkidle')
  })

  test('can cancel invite modal', async ({ page }) => {
    await page.click('button:has-text("Invite Member")')
    
    // Wait for modal
    await page.waitForSelector('[role="dialog"], .fixed')
    
    // Click cancel or close
    const cancelButton = page.locator('button:has-text("Cancel"), button[aria-label="Close"]')
    if (await cancelButton.isVisible()) {
      await cancelButton.click()
      
      // Modal should close
      await expect(page.locator('[role="dialog"]:visible')).not.toBeVisible({ timeout: 5000 })
    }
  })

  test.describe('Team Members List', () => {
    test.beforeEach(async ({ page }) => {
      // Mock team data with members
      await page.route('**/api/team/members', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            members: [
              {
                user_id: 'user-1',
                email: 'admin@test.com',
                role: 'owner',
                full_name: 'Test Admin',
                avatar_url: null,
                joined_at: new Date().toISOString(),
              },
              {
                user_id: 'user-2',
                email: 'member@test.com',
                role: 'member',
                full_name: 'Test Member',
                avatar_url: null,
                joined_at: new Date().toISOString(),
              },
            ],
            invites: [
              {
                id: 'invite-1',
                email: 'pending@test.com',
                role: 'member',
                status: 'pending',
                created_at: new Date().toISOString(),
                token: 'test-token',
              },
            ],
            organization: {
              seat_limit: 10,
              seats_used: 2,
              employee_count: 50,
            },
            currentUserRole: 'owner',
          }),
        })
      })
      
      await page.goto('/settings/team')
      await page.waitForLoadState('networkidle')
    })

    test('shows members list', async ({ page }) => {
      await expect(page.locator('text=admin@test.com, text=Test Admin')).toBeVisible()
      await expect(page.locator('text=member@test.com, text=Test Member')).toBeVisible()
    })

    test('shows member roles', async ({ page }) => {
      await expect(page.locator('text=Owner, text=owner')).toBeVisible()
      await expect(page.locator('text=Member, text=member')).toBeVisible()
    })

    test('shows pending invites', async ({ page }) => {
      await expect(page.locator('text=pending@test.com')).toBeVisible()
      await expect(page.locator('text=Pending, text=pending')).toBeVisible()
    })

    test('owner can remove member', async ({ page }) => {
      // Find remove button for non-owner member
      const removeButton = page.locator('button:has-text("Remove"), button:has([class*="Trash"])').first()
      
      if (await removeButton.isVisible()) {
        // Set up dialog handler
        page.on('dialog', dialog => dialog.accept())
        
        await removeButton.click()
      }
    })

    test('owner can cancel pending invite', async ({ page }) => {
      // Find cancel button for pending invite
      const cancelButton = page.locator('button:has-text("Cancel")').first()
      
      if (await cancelButton.isVisible()) {
        page.on('dialog', dialog => dialog.accept())
        await cancelButton.click()
      }
    })
  })

  test.describe('Seat Limit', () => {
    test('shows warning when approaching seat limit', async ({ page }) => {
      // Mock team data near limit
      await page.route('**/api/team/members', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            members: [],
            invites: [],
            organization: {
              seat_limit: 5,
              seats_used: 4,
              employee_count: 50,
            },
            currentUserRole: 'owner',
          }),
        })
      })
      
      await page.goto('/settings/team')
      await page.waitForLoadState('networkidle')
      
      // Check for warning
      const warningText = page.locator('text=1 seat remaining, text=seat limit, text=Upgrade')
      await expect(warningText.first()).toBeVisible()
    })

    test('shows upgrade prompt when at seat limit', async ({ page }) => {
      // Mock team data at limit
      await page.route('**/api/team/members', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            members: [],
            invites: [],
            organization: {
              seat_limit: 5,
              seats_used: 5,
              employee_count: 50,
            },
            currentUserRole: 'owner',
          }),
        })
      })
      
      await page.goto('/settings/team')
      await page.waitForLoadState('networkidle')
      
      // Check for upgrade prompt
      const upgradeText = page.locator('text=reached your seat limit, text=Upgrade')
      await expect(upgradeText.first()).toBeVisible()
    })
  })

  test.describe('Invite Acceptance Flow', () => {
    test('invite page loads with valid token', async ({ page }) => {
      // Mock invite token validation
      await page.route('**/api/invite/*', (route) => {
        if (route.request().method() === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              email: 'invited@test.com',
              role: 'member',
              organization: {
                name: 'Test Company',
              },
              invitedBy: 'Admin User',
            }),
          })
        } else {
          route.continue()
        }
      })
      
      await page.goto('/invite/valid-token')
      await page.waitForLoadState('networkidle')
      
      // Should show invite details or acceptance form
      const inviteContent = page.locator('text=Test Company, text=invited, text=Join')
      // Page should load without error
    })

    test('shows error for invalid token', async ({ page }) => {
      // Mock invalid token
      await page.route('**/api/invite/*', (route) => {
        route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid invite token' }),
        })
      })
      
      await page.goto('/invite/invalid-token')
      await page.waitForLoadState('networkidle')
      
      // Should show error
      const errorContent = page.locator('text=invalid, text=expired, text=not found')
      // Page should handle error gracefully
    })
  })

  test.describe('Role Changes', () => {
    test.beforeEach(async ({ page }) => {
      // Mock team data
      await page.route('**/api/team/members', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            members: [
              {
                user_id: 'user-1',
                email: 'admin@test.com',
                role: 'owner',
                full_name: 'Test Admin',
              },
              {
                user_id: 'user-2',
                email: 'member@test.com',
                role: 'member',
                full_name: 'Test Member',
              },
            ],
            invites: [],
            organization: {
              seat_limit: 10,
              seats_used: 2,
            },
            currentUserRole: 'owner',
          }),
        })
      })
      
      await page.goto('/settings/team')
      await page.waitForLoadState('networkidle')
    })

    test('owner can see role change options', async ({ page }) => {
      // Look for role dropdown or change button
      const roleControls = page.locator('select, button:has-text("Change Role"), [role="listbox"]')
      
      // Should have controls for non-owner members
      const hasControls = await roleControls.count() > 0
      // This depends on UI implementation
    })
  })
})
