# Changelog

## 2026-03-14
- Added initial documentation files for SupplySync AI.
- Added Next.js App Router structure, Supabase client utilities, auth pages, dashboard, and supplier CRUD UI.
- Added Supabase migration with RLS and storage policies plus seed script.
- Updated dashboard styling with icon stat cards, modern header, and upgraded supplier table.
- Added AI Insights page with supplier performance and risk highlights.
- Added Supabase admin client for tenant bootstrap to avoid RLS failures on first login.
- fix(auth): make ensureUserAndTenant upsert users to avoid duplicate key errors.
- Updated documentation to align with Jaggaer blueprint scope, schema, API, and roadmap.
- Added expanded Supabase schema migration for procurement, contracts, invoicing, RFQ, approvals, and supporting tables.
- Added purchase orders module (list, create, detail) with validation and navigation links.
- Added header logout action to end Supabase session.
- Refactored dashboard layout, UI kit, charts, supplier flows, and toast/skeleton UX polish.
- Fixed async cookies usage and typing mismatches in server routes and purchase order supplier joins.
- Expanded seed script to generate 50 records per table and added auth validations, toasts, theme toggle, and dark-mode styling updates.
- Added blueprint features not yet in product: PRD section "Features from Blueprint Not Yet in Product" (Inventory, Supply Chain Mapping, Crisis Management, ESG, Blockchain, IoT, Smart Contract, Mobile). Sidebar expanded with Procurement, Finance & Compliance, Insights, Supplier, and Extended sections; new pages: Inventory, Supply Chain Mapping, Crisis & Continuity, ESG Monitoring.
- Seed script: invoice statuses now include paid, approved, pending, disputed, draft; seed logs all tables covered. Added dummy in-page data for Inventory, Supply Chain Mapping, Crisis & Continuity, and ESG pages for testing without DB.
- Aligned supplier-related tables (documents, certifications, compliance_records, activity_logs) with PRD names via a new Supabase migration and updated services/seed/docs to consume the renamed references.
- Added stat-focused compliance and document dashboards with client-side filters so reviewers can quickly surface expiring certifications and key supplier documents.
- Added migration for procurement-specific supplier/compliance fields, unique indexes for upserts, and a new `seed-suppliers` script targeting the Bacancy tenant.
- Enhanced certifications and scorecards pages to fetch live data, display stats, and show detailed tables using the shared services layer.
- Fixed payments page backend to order by `processed_at`, aligning with the actual column set in the schema.
- Added Supabase-powered supplier search with debounced API queries and pruned sidebar/mobile nav items to the core SaaS modules.
- Restored PRD navigation links for onboarding and scorecards so every core feature remains front-door accessible.
- Updated the suppliers table to show status badges and a dedicated edit action column instead of linking the status text.
