# SupplySync AI — Architecture

## Overview
- Next.js 15 App Router (RSC-first)
- Supabase for auth, Postgres, storage, and RLS
- Tailwind + shadcn/ui
- Server Actions for mutations; API routes for complex workflows

## Core Domains
- Supplier Management
- Procurement (POs, Receipts)
- Invoicing & Payments
- Contracts & Compliance
- Sourcing (RFQ/Bids)
- Performance & Risk
- Analytics & Reporting
- Workflow & Approvals
- Notifications & Audit

## Integration Points
- Financial systems for payments and reconciliation
- Inventory systems for stock and reordering
- External risk/compliance data providers
- Email/SMS providers for notifications

## Security
- Tenant-scoped RLS policies on all tables
- Service role for privileged server actions
- Audit logging for all workflow actions

## AI Layer (Planned)
- Recommendation engine
- Risk prediction models
- NLP contract analysis
- Pricing intelligence
