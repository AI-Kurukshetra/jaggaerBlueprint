# Decisions

## 2026-03-14
- Established conceptual SRM schema and module breakdown to guide initial implementation.
- Implemented tenant-scoped RLS via current_tenant_id() and per-table policies.
- Seed data is provided via a service-role Node script to create demo auth users and supplier data.
- Tenant bootstrap uses server-only service role client to bypass RLS during initial workspace creation.
- Adopted Jaggaer blueprint feature set as target scope, organized into phased roadmap (MVP → Core → Enhancements → Advanced → Innovation).
- Introduced a shared UI kit in components/ui with lucide-react icons to standardize dashboard styling and interaction patterns.
- Implemented class-based light/dark theming with localStorage persistence and global Tailwind overrides for rapid coverage across existing UI.
- Renamed the supplier document/compliance tables to `documents`, `certifications`, `compliance_records`, and `activity_logs` (and added a migration) so the concrete schema matches the PRD entities while preserving the existing RLS/policy wiring.
- Added explicit supplier contact/country/status fields and compliance/certification date fields to align seeded procurement data with the PRD and support dashboard metrics.
