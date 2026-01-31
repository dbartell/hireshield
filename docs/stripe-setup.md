# Stripe Setup Guide

## 1. Create Stripe Account
Go to https://dashboard.stripe.com and create an account (or use existing).

## 2. Create Products & Prices

In Stripe Dashboard → Products → Add Product:

### Pilot Plan ($99/mo)
- Name: AIHireLaw Pilot
- Price: $99.00 USD, recurring monthly
- Copy the `price_xxx` ID

### Standard Plan ($199/mo)
- Name: AIHireLaw Standard  
- Price: $199.00 USD, recurring monthly
- Copy the `price_xxx` ID

### Annual Plan ($1,990/yr)
- Name: AIHireLaw Annual
- Price: $1,990.00 USD, recurring yearly
- Copy the `price_xxx` ID

## 3. Get API Keys

In Stripe Dashboard → Developers → API Keys:
- Copy **Publishable key** (pk_test_xxx or pk_live_xxx)
- Copy **Secret key** (sk_test_xxx or sk_live_xxx)

## 4. Set Up Webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

Copy the **Webhook signing secret** (whsec_xxx)

## 5. Configure Environment Variables

Add to `.env.local`:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Price IDs (from step 2)
STRIPE_PRICE_PILOT=price_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_ANNUAL=price_xxx
```

## 6. Run Database Migration

```bash
# Via Supabase CLI
supabase db push

# Or manually run in SQL editor:
# supabase/migrations/003_stripe_subscriptions.sql
```

## 7. Configure Customer Portal

In Stripe Dashboard → Settings → Billing → Customer portal:

- Enable "Allow customers to update payment methods"
- Enable "Allow customers to cancel subscriptions"
- Enable "Allow customers to view invoice history"
- Set return URL to `https://yourdomain.com/dashboard`

## 8. Test Flow

1. Go to `/pricing`
2. Click "Get Started" on Pilot plan
3. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
4. Should redirect to dashboard with `?checkout=success`
5. Check Stripe Dashboard for the subscription
6. Check Supabase for updated `profiles` row

## Local Development

For local webhook testing, use Stripe CLI:

```bash
# Install
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret it provides
```

## Going Live

1. Complete Stripe account activation
2. Switch to live API keys (pk_live_xxx, sk_live_xxx)
3. Create live products/prices (or copy from test mode)
4. Update webhook endpoint to production URL
5. Test with a real card (refund immediately)
