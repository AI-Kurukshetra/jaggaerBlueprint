-- SupplySync AI schema

create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  name text not null,
  category text not null,
  email text not null,
  phone text not null,
  location text not null,
  risk_score integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  file_path text not null,
  expires_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_certifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  name text not null,
  issuer text not null,
  expires_at date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  delivery_score integer not null,
  quality_score integer not null,
  service_score integer not null,
  overall_score integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_activity (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  activity_type text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.users where id = auth.uid();
$$;

create or replace function public.sync_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger suppliers_updated_at
before update on public.suppliers
for each row execute function public.sync_updated_at();

create or replace function public.set_supplier_tenant_id()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    new.tenant_id = public.current_tenant_id();
  end if;
  return new;
end;
$$;

create trigger suppliers_tenant
before insert on public.suppliers
for each row execute function public.set_supplier_tenant_id();

create or replace function public.set_child_tenant_id()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.suppliers where id = new.supplier_id;
  end if;
  return new;
end;
$$;

create trigger supplier_documents_tenant
before insert on public.supplier_documents
for each row execute function public.set_child_tenant_id();

create trigger supplier_certifications_tenant
before insert on public.supplier_certifications
for each row execute function public.set_child_tenant_id();

create trigger supplier_scorecards_tenant
before insert on public.supplier_scorecards
for each row execute function public.set_child_tenant_id();

create trigger supplier_activity_tenant
before insert on public.supplier_activity
for each row execute function public.set_child_tenant_id();

alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_documents enable row level security;
alter table public.supplier_certifications enable row level security;
alter table public.supplier_scorecards enable row level security;
alter table public.supplier_activity enable row level security;

create policy "tenants_select" on public.tenants
for select
using (id = public.current_tenant_id());

create policy "tenants_insert" on public.tenants
for insert
with check (auth.uid() is not null and owner_id = auth.uid());

create policy "tenants_update" on public.tenants
for update
using (owner_id = auth.uid());

create policy "users_select" on public.users
for select
using (id = auth.uid());

create policy "users_insert" on public.users
for insert
with check (id = auth.uid());

create policy "users_update" on public.users
for update
using (id = auth.uid());

create policy "suppliers_select" on public.suppliers
for select
using (tenant_id = public.current_tenant_id());

create policy "suppliers_insert" on public.suppliers
for insert
with check (tenant_id = public.current_tenant_id());

create policy "suppliers_update" on public.suppliers
for update
using (tenant_id = public.current_tenant_id());

create policy "suppliers_delete" on public.suppliers
for delete
using (tenant_id = public.current_tenant_id());

create policy "supplier_documents_access" on public.supplier_documents
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_certifications_access" on public.supplier_certifications
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_scorecards_access" on public.supplier_scorecards
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_activity_access" on public.supplier_activity
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

-- Storage bucket for supplier documents
insert into storage.buckets (id, name, public)
values ('supplier-documents', 'supplier-documents', false)
on conflict (id) do nothing;

create policy "supplier_docs_select" on storage.objects
for select
using (
  bucket_id = 'supplier-documents'
  and exists (
    select 1 from public.suppliers
    where id = split_part(name, '/', 1)::uuid
      and tenant_id = public.current_tenant_id()
  )
);

create policy "supplier_docs_insert" on storage.objects
for insert
with check (
  bucket_id = 'supplier-documents'
  and exists (
    select 1 from public.suppliers
    where id = split_part(name, '/', 1)::uuid
      and tenant_id = public.current_tenant_id()
  )
);

create policy "supplier_docs_delete" on storage.objects
for delete
using (
  bucket_id = 'supplier-documents'
  and exists (
    select 1 from public.suppliers
    where id = split_part(name, '/', 1)::uuid
      and tenant_id = public.current_tenant_id()
  )
);

create index if not exists suppliers_tenant_idx on public.suppliers(tenant_id);
create index if not exists suppliers_risk_idx on public.suppliers(risk_score);
create index if not exists supplier_docs_supplier_idx on public.supplier_documents(supplier_id);
create index if not exists supplier_certs_expiry_idx on public.supplier_certifications(expires_at);
