-- Expanded SupplySync AI schema for procurement, contracts, invoicing, RFQ, approvals, and analytics

create table if not exists public.supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  risk_score integer not null default 0,
  risk_level text not null default 'medium',
  summary text,
  assessed_at timestamptz not null default now()
);

create table if not exists public.supplier_compliance_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  policy_name text not null,
  status text not null default 'pending',
  notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_diversity_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  category text not null,
  status text not null default 'pending',
  certifying_body text,
  valid_until date,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_catalogs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  name text not null,
  parent_id uuid references public.product_categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  catalog_id uuid references public.supplier_catalogs(id) on delete set null,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  sku text,
  price numeric(12,2),
  currency text,
  availability text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  po_number text,
  status text not null default 'draft',
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  requested_by uuid references public.users(id) on delete set null,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  purchase_order_id uuid references public.purchase_orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text,
  quantity numeric(12,2) not null default 0,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create table if not exists public.goods_receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  purchase_order_id uuid references public.purchase_orders(id) on delete cascade,
  received_by uuid references public.users(id) on delete set null,
  received_at timestamptz not null default now(),
  status text not null default 'received',
  notes text
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  invoice_number text,
  status text not null default 'pending',
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  issued_at date,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete cascade,
  description text,
  quantity numeric(12,2) not null default 0,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  status text not null default 'pending',
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  processed_at timestamptz,
  provider text,
  reference text
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  start_date date,
  end_date date,
  renewal_date date,
  value numeric(12,2),
  currency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contract_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete cascade,
  version integer not null default 1,
  file_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  rfq_id uuid references public.rfqs(id) on delete cascade,
  product_name text not null,
  quantity numeric(12,2) not null default 0,
  specs text
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  rfq_id uuid references public.rfqs(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  status text not null default 'submitted',
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.bid_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  bid_id uuid references public.bids(id) on delete cascade,
  product_name text not null,
  quantity numeric(12,2) not null default 0,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  name text not null,
  resource_type text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete cascade,
  step_order integer not null,
  approver_role text not null,
  approval_threshold numeric(12,2),
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  resource_type text not null,
  resource_id uuid not null,
  status text not null default 'pending',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.approval_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  approval_id uuid references public.approvals(id) on delete cascade,
  step_order integer not null,
  status text not null default 'pending',
  approved_by uuid references public.users(id) on delete set null,
  decided_at timestamptz
);

create table if not exists public.performance_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete cascade,
  metric_name text not null,
  value numeric(12,2) not null default 0,
  period_start date,
  period_end date,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  name text not null,
  version text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  period_start date not null,
  period_end date not null,
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  type text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  base_currency text not null,
  quote_currency text not null,
  rate numeric(18,6) not null,
  as_of date not null
);

-- Tenant helpers
create or replace function public.set_tenant_id_from_supplier()
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

create or replace function public.set_tenant_id_from_catalog()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.supplier_catalogs where id = new.catalog_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_purchase_order()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.purchase_orders where id = new.purchase_order_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_invoice()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.invoices where id = new.invoice_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_contract()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.contracts where id = new.contract_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_rfq()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.rfqs where id = new.rfq_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_bid()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.bids where id = new.bid_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_workflow()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.workflows where id = new.workflow_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_approval()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.approvals where id = new.approval_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_tenant_id_from_user()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is null then
    select tenant_id into new.tenant_id from public.users where id = new.user_id;
  end if;
  return new;
end;
$$;

-- Updated-at triggers
create trigger products_updated_at
before update on public.products
for each row execute function public.sync_updated_at();

create trigger purchase_orders_updated_at
before update on public.purchase_orders
for each row execute function public.sync_updated_at();

create trigger contracts_updated_at
before update on public.contracts
for each row execute function public.sync_updated_at();

-- Tenant triggers
create trigger supplier_contacts_tenant
before insert on public.supplier_contacts
for each row execute function public.set_child_tenant_id();

create trigger supplier_risk_assessments_tenant
before insert on public.supplier_risk_assessments
for each row execute function public.set_child_tenant_id();

create trigger supplier_compliance_records_tenant
before insert on public.supplier_compliance_records
for each row execute function public.set_child_tenant_id();

create trigger supplier_diversity_profiles_tenant
before insert on public.supplier_diversity_profiles
for each row execute function public.set_child_tenant_id();

create trigger supplier_catalogs_tenant
before insert on public.supplier_catalogs
for each row execute function public.set_child_tenant_id();

create trigger products_tenant
before insert on public.products
for each row execute function public.set_tenant_id_from_catalog();

create trigger purchase_order_items_tenant
before insert on public.purchase_order_items
for each row execute function public.set_tenant_id_from_purchase_order();

create trigger goods_receipts_tenant
before insert on public.goods_receipts
for each row execute function public.set_tenant_id_from_purchase_order();

create trigger invoice_items_tenant
before insert on public.invoice_items
for each row execute function public.set_tenant_id_from_invoice();

create trigger contract_versions_tenant
before insert on public.contract_versions
for each row execute function public.set_tenant_id_from_contract();

create trigger rfq_items_tenant
before insert on public.rfq_items
for each row execute function public.set_tenant_id_from_rfq();

create trigger bid_items_tenant
before insert on public.bid_items
for each row execute function public.set_tenant_id_from_bid();

create trigger workflow_steps_tenant
before insert on public.workflow_steps
for each row execute function public.set_tenant_id_from_workflow();

create trigger approval_steps_tenant
before insert on public.approval_steps
for each row execute function public.set_tenant_id_from_approval();

create trigger notifications_tenant
before insert on public.notifications
for each row execute function public.set_tenant_id_from_user();

-- Enable RLS
alter table public.supplier_contacts enable row level security;
alter table public.supplier_risk_assessments enable row level security;
alter table public.supplier_compliance_records enable row level security;
alter table public.supplier_diversity_profiles enable row level security;
alter table public.supplier_catalogs enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.goods_receipts enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_versions enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.bids enable row level security;
alter table public.bid_items enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_steps enable row level security;
alter table public.approvals enable row level security;
alter table public.approval_steps enable row level security;
alter table public.performance_metrics enable row level security;
alter table public.risk_models enable row level security;
alter table public.departments enable row level security;
alter table public.budgets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.exchange_rates enable row level security;

-- RLS policies
create policy "supplier_contacts_access" on public.supplier_contacts
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_risk_assessments_access" on public.supplier_risk_assessments
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_compliance_records_access" on public.supplier_compliance_records
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_diversity_profiles_access" on public.supplier_diversity_profiles
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "supplier_catalogs_access" on public.supplier_catalogs
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "product_categories_access" on public.product_categories
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "products_access" on public.products
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "purchase_orders_access" on public.purchase_orders
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "purchase_order_items_access" on public.purchase_order_items
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "goods_receipts_access" on public.goods_receipts
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "invoices_access" on public.invoices
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "invoice_items_access" on public.invoice_items
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "payments_access" on public.payments
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "contracts_access" on public.contracts
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "contract_versions_access" on public.contract_versions
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "rfqs_access" on public.rfqs
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "rfq_items_access" on public.rfq_items
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "bids_access" on public.bids
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "bid_items_access" on public.bid_items
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "workflows_access" on public.workflows
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "workflow_steps_access" on public.workflow_steps
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "approvals_access" on public.approvals
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "approval_steps_access" on public.approval_steps
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "performance_metrics_access" on public.performance_metrics
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "risk_models_access" on public.risk_models
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "departments_access" on public.departments
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "budgets_access" on public.budgets
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "audit_logs_access" on public.audit_logs
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "notifications_access" on public.notifications
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "exchange_rates_access" on public.exchange_rates
for all
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

-- Indexes
create index if not exists supplier_contacts_supplier_idx on public.supplier_contacts(supplier_id);
create index if not exists supplier_risk_assessments_supplier_idx on public.supplier_risk_assessments(supplier_id);
create index if not exists supplier_compliance_records_supplier_idx on public.supplier_compliance_records(supplier_id);
create index if not exists supplier_diversity_profiles_supplier_idx on public.supplier_diversity_profiles(supplier_id);
create index if not exists supplier_catalogs_supplier_idx on public.supplier_catalogs(supplier_id);
create index if not exists product_categories_tenant_idx on public.product_categories(tenant_id);
create index if not exists products_catalog_idx on public.products(catalog_id);
create index if not exists purchase_orders_tenant_idx on public.purchase_orders(tenant_id);
create index if not exists purchase_order_items_po_idx on public.purchase_order_items(purchase_order_id);
create index if not exists goods_receipts_po_idx on public.goods_receipts(purchase_order_id);
create index if not exists invoices_po_idx on public.invoices(purchase_order_id);
create index if not exists invoice_items_invoice_idx on public.invoice_items(invoice_id);
create index if not exists payments_invoice_idx on public.payments(invoice_id);
create index if not exists contracts_supplier_idx on public.contracts(supplier_id);
create index if not exists contract_versions_contract_idx on public.contract_versions(contract_id);
create index if not exists rfqs_tenant_idx on public.rfqs(tenant_id);
create index if not exists rfq_items_rfq_idx on public.rfq_items(rfq_id);
create index if not exists bids_rfq_idx on public.bids(rfq_id);
create index if not exists bid_items_bid_idx on public.bid_items(bid_id);
create index if not exists workflows_tenant_idx on public.workflows(tenant_id);
create index if not exists workflow_steps_workflow_idx on public.workflow_steps(workflow_id);
create index if not exists approvals_tenant_idx on public.approvals(tenant_id);
create index if not exists approval_steps_approval_idx on public.approval_steps(approval_id);
create index if not exists performance_metrics_supplier_idx on public.performance_metrics(supplier_id);
create index if not exists budgets_department_idx on public.budgets(department_id);
create index if not exists notifications_user_idx on public.notifications(user_id);
create index if not exists audit_logs_actor_idx on public.audit_logs(actor_id);
create index if not exists exchange_rates_pair_idx on public.exchange_rates(base_currency, quote_currency, as_of);
