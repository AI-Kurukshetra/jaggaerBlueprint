-- Align tables with the SupplySync AI PRD nomenclature

alter table public.supplier_certifications rename to certifications;
alter table public.supplier_documents rename to documents;
alter table public.supplier_compliance_records rename to compliance_records;
alter table public.supplier_activity rename to activity_logs;

-- Ensure RLS is explicitly enforced for the renamed tables
alter table public.certifications enable row level security;
alter table public.documents enable row level security;
alter table public.compliance_records enable row level security;
alter table public.activity_logs enable row level security;

-- Rename supporting indexes so they remain descriptive after the rename
alter index if exists supplier_docs_supplier_idx rename to documents_supplier_idx;
alter index if exists supplier_certs_expiry_idx rename to certifications_expiry_idx;
alter index if exists supplier_compliance_records_supplier_idx rename to compliance_records_supplier_idx;

-- Replace legacy policies with PRD-inspired names
drop policy if exists "supplier_documents_access" on public.documents;
create policy "documents_access" on public.documents
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

drop policy if exists "supplier_certifications_access" on public.certifications;
create policy "certifications_access" on public.certifications
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

drop policy if exists "supplier_compliance_records_access" on public.compliance_records;
create policy "compliance_records_access" on public.compliance_records
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

drop policy if exists "supplier_activity_access" on public.activity_logs;
create policy "activity_logs_access" on public.activity_logs
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());
