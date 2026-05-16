# Deployment Checklist

Follow these steps in order to transition from local development to a live production environment.

## 1. Pre-Deploy Validation
Run these commands locally before any git push:
- [ ] `npx prisma validate` - Ensure schema is sound.
- [ ] `npm run lint` - Check for code style/error consistency.
- [ ] `npm run build` - Verify the app compiles for production.

## 2. Database (Supabase) Setup
- [ ] Create a new project on [Supabase](https://supabase.com).
- [ ] Go to Project Settings -> Database.
- [ ] Copy the **Transaction** connection string.
- [ ] Apply the schema: `npx prisma db push` (from local, pointing to production URL).
- [ ] Verify tables (`Lead`, `AIModule`, `EmployabilityScore`) are created.

## 3. Webhook (Tally) Setup
- [ ] Open your Tally form settings.
- [ ] Navigate to **Webhooks**.
- [ ] Endpoint URL: `https://your-domain.vercel.app/api/intake`
- [ ] Set your **Signing Secret** and match it to your `TALLY_SECRET` env var.
- [ ] Send a test payload to verify connectivity.

## 4. Vercel Deployment
- [ ] Connect your repository to Vercel.
- [ ] Input all required environment variables (see `ENV_SETUP_GUIDE.md`).
- [ ] Trigger deployment.
- [ ] Verify logs for successful build and dynamic route generation.

## 5. Post-Deploy Sanity Check
- [ ] Access `/admin/dashboard` using your `ADMIN_PASSWORD`.
- [ ] Generate a **Sandbox Lead** via the Stress Test API.
- [ ] Run a **Diagnostic Audit** on the test lead.
- [ ] Verify the **Client Portal** link works and data is sanitized.
- [ ] Export a **Strategy PDF** and verify branding.
