# SupplySync AI — Setup Guide

## Prerequisites
- Node.js LTS
- pnpm
- Supabase CLI

## Local Setup
1. Install dependencies:
   - `pnpm install`
2. Start Supabase locally:
   - `supabase start`
3. Copy env:
   - Create `.env.local` from `.env.example`
4. Run dev server:
   - `pnpm dev`

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## Common Scripts
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
