import { chromium, FullConfig } from '@playwright/test'

/**
 * Global setup for HireShield E2E tests
 * This runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  // Create auth directory if it doesn't exist
  const fs = await import('fs/promises')
  try {
    await fs.mkdir('e2e/.auth', { recursive: true })
  } catch (e) {
    // Directory exists
  }

  console.log('🔧 Global setup complete')
}

export default globalSetup
