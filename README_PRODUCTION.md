# EmployabilityOS - Production Architecture

This repository contains the core intelligence infrastructure for **EmployabilityOS**. It is designed as a private, high-fidelity internal MVP for strategic candidate repositioning.

## 🚀 Internal MVP Deployment

### 1. Local Development
```bash
# Install dependencies
npm install

# Setup Prisma
npx prisma generate

# Run in Mock Mode (Default if no DATABASE_URL)
npm run dev
```

### 2. Infrastructure Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Intelligence**: OpenAI (GPT-4o)
- **Exports**: jsPDF / html2canvas
- **Intake**: Tally.so Webhooks

### 3. Production Readiness
The system has been audited for:
- ✅ Type Safety (TypeScript Verified)
- ✅ Security (Sanitized Client Portals)
- ✅ Performance (Modular AI Execution)
- ✅ Compliance (Human-in-the-loop gates)

## 🛠️ Rollback Instructions
If a production deployment fails:
1. **Database**: If a schema change broke the app, run `npx prisma migrate resolve --rolled-back <migration_name>` or use Supabase snapshots to restore.
2. **Vercel**: Go to Vercel Dashboard -> Deployments -> Select previous stable deployment -> **Promote to Production**.
3. **AI**: If cost spikes, instantly set `USE_MOCK_DATA=true` in Vercel environment variables to freeze AI API usage while maintaining dashboard visibility.

## ⚠️ PROHIBITED ACTIONS (MVP STAGE)
- **DO NOT** enable Public Sign-up.
- **DO NOT** connect Stripe/Payments yet.
- **DO NOT** activate Auto-Delivery to clients.
- **DO NOT** add multiple admin accounts without NextAuth migration.
