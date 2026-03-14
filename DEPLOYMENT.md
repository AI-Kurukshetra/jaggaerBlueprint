# Deployment Guide

## Production Deploy (Vercel)
1. Connect the repository to a Vercel project that runs `pnpm` (default build command: `pnpm build`).
2. Add the required environment variables to Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
3. Configure the Supabase project:
   - Apply migrations (via Supabase CLI or dashboard).
   - Run the seed script (`pnpm seed`) locally or via a CI step to populate demo data.
4. Point Vercel to the correct branch (e.g., `main`) and deploy.
5. After deploy, visit `/login` to ensure authentication works with the configured Supabase project.

## Preview Deployments
- Ensure preview branches pass `pnpm lint` and `pnpm test`.
- Preview environments should reuse the same Supabase project (or a dedicated preview database) with credentials stored in Vercel preview env vars.

## Rollback / Safety
- Promote a previous Vercel deployment from the dashboard if a deploy causes issues.
- Update the Supabase schema before promoting; keep migration history under `supabase/migrations`.

