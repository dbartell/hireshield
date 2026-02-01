import { Page, APIRequestContext, expect } from '@playwright/test'

/**
 * API helpers for HireShield E2E tests
 */

export class ApiHelper {
  constructor(private page: Page) {}

  /**
   * Wait for an API response
   */
  async waitForResponse(urlPattern: string | RegExp, options?: { timeout?: number }) {
    return this.page.waitForResponse(
      (response) => {
        const url = response.url()
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern)
        }
        return urlPattern.test(url)
      },
      { timeout: options?.timeout || 10000 }
    )
  }

  /**
   * Wait for API request to complete
   */
  async waitForRequest(urlPattern: string | RegExp, options?: { timeout?: number }) {
    return this.page.waitForRequest(
      (request) => {
        const url = request.url()
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern)
        }
        return urlPattern.test(url)
      },
      { timeout: options?.timeout || 10000 }
    )
  }

  /**
   * Intercept and mock an API response
   */
  async mockResponse(urlPattern: string | RegExp, response: object, options?: { status?: number }) {
    await this.page.route(urlPattern, (route) => {
      route.fulfill({
        status: options?.status || 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      })
    })
  }

  /**
   * Intercept API and delay response
   */
  async delayResponse(urlPattern: string | RegExp, delayMs: number) {
    await this.page.route(urlPattern, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      await route.continue()
    })
  }

  /**
   * Intercept API and return error
   */
  async mockError(urlPattern: string | RegExp, errorMessage: string, statusCode: number = 500) {
    await this.page.route(urlPattern, (route) => {
      route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({ error: errorMessage }),
      })
    })
  }

  /**
   * Remove all route mocks
   */
  async clearMocks() {
    await this.page.unrouteAll()
  }

  /**
   * Get all API calls made during test
   */
  async captureRequests(urlPattern: string | RegExp): Promise<{ url: string; method: string; body: any }[]> {
    const requests: { url: string; method: string; body: any }[] = []
    
    await this.page.route(urlPattern, async (route, request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        body: request.postDataJSON(),
      })
      await route.continue()
    })
    
    return requests
  }
}

/**
 * Create API helper
 */
export function createApiHelper(page: Page) {
  return new ApiHelper(page)
}

/**
 * Mock Supabase auth for testing
 */
export async function mockSupabaseAuth(page: Page, user: { id: string; email: string }) {
  await page.route('**/auth/**', (route) => {
    const url = route.request().url()
    
    if (url.includes('/token')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user,
        }),
      })
    } else if (url.includes('/user')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user),
      })
    } else {
      route.continue()
    }
  })
}

/**
 * Mock Stripe checkout for testing
 */
export async function mockStripeCheckout(page: Page) {
  await page.route('**/api/checkout', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: '/dashboard?checkout=success',
      }),
    })
  })
}

/**
 * Mock Merge.dev integration for testing
 */
export async function mockMergeIntegration(page: Page) {
  await page.route('**/api/integrations/merge/**', (route) => {
    const url = route.request().url()
    
    if (url.includes('/link')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          linkToken: 'mock-link-token',
          magicLinkUrl: null,
        }),
      })
    } else if (url.includes('/sync')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          stats: { candidates: 10, applications: 25 },
        }),
      })
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ integrations: [] }),
      })
    }
  })
}

/**
 * Mock email sending for testing
 */
export async function mockEmailSending(page: Page) {
  await page.route('**/api/email/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })
}
