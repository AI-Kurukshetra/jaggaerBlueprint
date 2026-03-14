-- Add procurement-specific supplier/compliance fields for targeted seeding

alter table public.suppliers
  add column if not exists contact_email text,
  add column if not exists country text,
  add column if not exists status text not null default 'active';

create or replace function public.set_supplier_contact_email()
returns trigger
language plpgsql
as $$
begin
  if new.contact_email is null then
    new.contact_email = new.email;
  end if;
  return new;
end;
$$;

create trigger suppliers_contact_email_default
before insert on public.suppliers
for each row execute function public.set_supplier_contact_email();

alter table public.certifications
  add column if not exists issued_at date;

alter table public.compliance_records
  add column if not exists certification_name text,
  add column if not exists issue_date date,
  add column if not exists expiry_date date;

-- Helpful indexes for filtering
create index if not exists suppliers_status_idx on public.suppliers(status);
create index if not exists suppliers_country_idx on public.suppliers(country);
create index if not exists compliance_records_expiry_idx on public.compliance_records(expiry_date);

-- Uniqueness constraints to support upserts in seeds
create unique index if not exists suppliers_tenant_name_uidx on public.suppliers(tenant_id, name);
create unique index if not exists supplier_scorecards_tenant_supplier_uidx on public.supplier_scorecards(tenant_id, supplier_id);
create unique index if not exists certifications_tenant_supplier_name_uidx on public.certifications(tenant_id, supplier_id, name);
create unique index if not exists documents_tenant_supplier_filename_uidx on public.documents(tenant_id, supplier_id, file_name);
create unique index if not exists compliance_records_tenant_supplier_cert_uidx on public.compliance_records(tenant_id, supplier_id, certification_name);
