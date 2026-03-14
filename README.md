# SupplySync AI

SupplySync AI is a lightweight Supplier Relationship Management (SRM) workspace that gives procurement, compliance, and operations teams a single-pane view of supplier directories, performance, compliance, and documents.

## Problem
Procurement teams survive in a fractured world of spreadsheets, email, and one-off tools. Supplier onboarding is slow, compliance visibility is low, and supplier relationships become yet another operational risk to audit.

## Solution
SupplySync AI centralizes supplier data, automates onboarding, monitors certifications, and highlights performance insights so procurement teams can move faster and stay risk-aware without a heavy ERP rollout.

## Features
- Supplier Directory
- Supplier Onboarding
- Performance Scorecards
- Compliance Tracking
- Document Management
- Analytics Dashboard

## Tech Stack
- Next.js (App Router)
- Supabase (PostgreSQL + Auth + Storage + RLS)
- TailwindCSS
- Vercel

## Architecture
- **Frontend**: A Next.js App Router surface drives public auth routes (`/login`, `/signup`) and the authenticated dashboard (`/dashboard/*`). Layouts enforce Supabase sessions and tenant checks.
- **Backend**: Supabase handles auth, RLS, storage, and functions. The server-side `services/*` modules orchestrate Supabase queries and exposures that every page consumes.
- **Database**: Postgres tables (`suppliers`, `certifications`, `documents`, `supplier_scorecards`, `compliance_records`, `activity_logs`, `tenants`, `users`) include triggers/policies that enforce tenant isolation.

## Setup Instructions
1. `pnpm install`
2. Copy `.env.example` to `.env.local` and fill in the Supabase credentials.
3. Run Supabase migrations (`pnpm supabase db push` or similar) to create tables.
4. Seed the database via `pnpm seed` (requires Supabase URL + service role key).
5. Start the dev server with `pnpm dev`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deployment
1. Target Vercel as the hosting platform with the Next.js project linked.
2. Set the same environment variables in the Vercel dashboard for Preview/Production.
3. Install pnpm as the package manager (already configured via `package.json`).
4. Ensure Supabase migrations and seeds are applied before first launch.

## Demo Credentials
- Email: `demo@supply-sync.ai`
- Password: `SupplySync@123`

