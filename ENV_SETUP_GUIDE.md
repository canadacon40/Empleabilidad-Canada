# Environment Setup Guide

These variables are required for the system to function in production mode. **Never hardcode these values.**

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase Postgres Connection String | `postgresql://postgres:[PASSWORD]@db.supabase.co:6543/postgres` |
| `DIRECT_URL` | Direct connection for migrations | `postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres` |
| `ADMIN_PASSWORD` | Master key for the admin dashboard | Use a strong alphanumeric string |
| `OPENAI_API_KEY` | Key for the intelligence engine | Starts with `sk-...` |
| `TALLY_SECRET` | Secret to verify intake webhooks | Any secret string (Match in Tally dashboard) |
| `USE_MOCK_DATA` | **CRITICAL** | Set to `false` for real operations. |
| `NEXT_PUBLIC_APP_URL`| The base URL of your portal | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Encryption key for admin sessions | Run `openssl rand -base64 32` |

## How to Set Up
1. **Local**: Create a `.env` file in the root directory.
2. **Vercel**: Add these in the "Environment Variables" section of your project settings.
3. **Supabase**: Ensure your `DATABASE_URL` uses the pooler (port 6543) for best performance with Vercel serverless functions.
