# HireShield E2E Test Suite

This directory contains comprehensive Playwright E2E tests for the HireShield application.

## Test Structure

```
e2e/
├── fixtures/           # Test data and auth helpers
│   ├── auth.ts        # Authentication helpers
│   └── test-data.ts   # Test data generators
├── helpers/           # Utility helpers
│   ├── api.ts         # API mocking helpers
│   ├── forms.ts       # Form interaction helpers
│   └── navigation.ts  # Navigation helpers
├── .auth/             # Stored auth state (gitignored)
├── marketing-to-signup.spec.ts    # Marketing → Signup flow
├── onboarding-flow.spec.ts        # Onboarding wizard tests
├── document-generation.spec.ts    # Document generation tests
├── ats-integration.spec.ts        # ATS integration tests
├── disclosure-page.spec.ts        # Disclosure page editor tests
├── team-invites.spec.ts           # Team management tests
├── training-flow.spec.ts          # Training module tests
├── compliance-documents.spec.ts   # Compliance documents tests
├── full-journey.spec.ts           # Complete E2E journey test
└── global.setup.ts               # Global test setup
```

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (visual debugging)
npm run test:e2e:ui

# Run tests in headed browser
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Running Specific Tests

```bash
# Run a specific test file
npx playwright test marketing-to-signup

# Run tests matching a pattern
npx playwright test --grep "signup"

# Run a specific test by line number
npx playwright test e2e/marketing-to-signup.spec.ts:15
```

## Test Configuration

The test configuration is in `playwright.config.ts`. Key settings:

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Workers**: 1 (sequential execution for auth state)
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Video**: On first retry
- **HTML Report**: Generated after each run

## Writing Tests

### Using Test Fixtures

```typescript
import { test, expect } from '@playwright/test'
import { testData, generateTestUser } from './fixtures/test-data'
import { createNavigationHelper } from './helpers/navigation'
import { createFormHelper } from './helpers/forms'

test('example test', async ({ page }) => {
  const nav = createNavigationHelper(page)
  const form = createFormHelper(page)
  
  await nav.goToDashboard()
  await form.fillInput('Email', 'test@example.com')
})
```

### Mocking APIs

```typescript
import { mockStripeCheckout, mockMergeIntegration } from './helpers/api'

test.beforeEach(async ({ page }) => {
  await mockStripeCheckout(page)
  await mockMergeIntegration(page)
})
```

### Data Test IDs

For reliable element selection, add `data-testid` attributes to components:

```tsx
<button data-testid="submit-btn">Submit</button>
```

Then select in tests:

```typescript
await page.locator('[data-testid="submit-btn"]').click()
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PLAYWRIGHT_BASE_URL` | Base URL for tests | `http://localhost:3000` |
| `TEST_USER_EMAIL` | Pre-seeded test user email | - |
| `TEST_USER_PASSWORD` | Pre-seeded test user password | - |

## CI Integration

For CI environments, tests expect:
1. The app running at `PLAYWRIGHT_BASE_URL`
2. A test database with seeded users (optional)
3. Email confirmation disabled or test user pre-confirmed

Example GitHub Actions workflow:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    PLAYWRIGHT_BASE_URL: http://localhost:3000
```

## Troubleshooting

### Tests failing to find elements

1. Check if the element has loaded: use `await expect().toBeVisible()`
2. Check for dynamic content: use `waitForSelector` or `waitForLoadState`
3. Add `data-testid` for more reliable selection

### Auth issues

1. Clear auth state: `rm -rf e2e/.auth/*`
2. Check if test user exists in database
3. Verify email confirmation is handled

### Timeouts

1. Increase timeout in test: `test.setTimeout(60000)`
2. Increase action timeout: `page.setDefaultTimeout(10000)`
3. Check for slow API responses

## Best Practices

1. **Keep tests independent**: Each test should be able to run alone
2. **Use meaningful assertions**: Verify both UI state and data
3. **Mock external services**: Stripe, email, OAuth should be mocked
4. **Clean up test data**: Tests should be idempotent
5. **Use page objects**: For complex pages, create helper classes
6. **Wait properly**: Use Playwright's built-in waiting, not `sleep`
