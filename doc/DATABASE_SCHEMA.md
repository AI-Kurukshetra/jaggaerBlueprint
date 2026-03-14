# SupplySync AI — Database Schema (Planned)

## Tenants
- `tenants`
  - `id` uuid PK
  - `name` text
  - `owner_id` uuid → auth.users
  - `created_at` timestamptz

## Users
- `users`
  - `id` uuid PK → auth.users
  - `tenant_id` uuid → tenants
  - `email` text
  - `role` text
  - `status` text
  - `created_at` timestamptz

## Suppliers
- `suppliers`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `name`, `category`, `email`, `contact_email`, `phone`, `location`, `country`
  - `status`, `risk_score`, `diversity_status`
  - `created_at`, `updated_at`
- `supplier_contacts`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `name`, `email`, `phone`, `role`

## Documents & Compliance
- `documents`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `document_type`, `file_name`, `file_path`
  - `expires_at` date
  - `created_at`
- `certifications`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `name`, `issuer`, `issued_at`
  - `expires_at` date
- `compliance_records`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `policy_name`, `certification_name`, `issue_date`, `expiry_date`, `status`, `notes`

## Performance & Risk
- `supplier_scorecards`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `delivery_score`, `quality_score`, `service_score`, `overall_score`
- `performance_metrics`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `metric_name`, `value`, `period_start`, `period_end`
- `supplier_risk_assessments`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `risk_score`, `risk_level`, `summary`

## Catalogs & Products
- `supplier_catalogs`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `name`, `status`
- `products`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `catalog_id` uuid → supplier_catalogs
  - `name`, `sku`, `price`, `currency`, `availability`
- `product_categories`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `name`

## Procurement
- `purchase_orders`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `status`, `total_amount`, `currency`
  - `created_at`, `approved_at`
- `purchase_order_items`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `purchase_order_id` uuid → purchase_orders
  - `product_id` uuid → products
  - `quantity`, `unit_price`, `line_total`
- `goods_receipts`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `purchase_order_id` uuid → purchase_orders
  - `received_at`, `status`

## Invoices & Payments
- `invoices`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `purchase_order_id` uuid → purchase_orders
  - `status`, `invoice_number`, `total_amount`, `currency`
- `invoice_items`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `invoice_id` uuid → invoices
  - `description`, `quantity`, `unit_price`, `line_total`
- `payments`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `invoice_id` uuid → invoices
  - `status`, `amount`, `currency`, `processed_at`

## Contracts
- `contracts`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `title`, `status`, `start_date`, `end_date`, `renewal_date`
- `contract_versions`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `contract_id` uuid → contracts
  - `version`, `file_path`, `created_at`

## RFQ / Bids
- `rfqs`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `title`, `status`, `due_date`
- `rfq_items`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `rfq_id` uuid → rfqs
  - `product_name`, `quantity`, `specs`
- `bids`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `rfq_id` uuid → rfqs
  - `supplier_id` uuid → suppliers
  - `status`, `total_amount`, `currency`
- `bid_items`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `bid_id` uuid → bids
  - `product_name`, `quantity`, `unit_price`

## Approvals & Workflows
- `workflows`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `name`, `resource_type`, `status`
- `workflow_steps`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `workflow_id` uuid → workflows
  - `step_order`, `approver_role`
- `approvals`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `resource_type`, `resource_id`, `status`
- `approval_steps`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `approval_id` uuid → approvals
  - `step_order`, `status`, `approved_by`

## Finance & Controls
- `budgets`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `department_id` uuid → departments
  - `period_start`, `period_end`, `amount`, `currency`
- `departments`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `name`
- `exchange_rates`
  - `id` uuid PK
  - `base_currency`, `quote_currency`, `rate`, `as_of`

## System
- `activity_logs`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `supplier_id` uuid → suppliers
  - `activity_type`, `summary`, `created_at`
- `audit_logs`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `actor_id` uuid → users
  - `action`, `resource_type`, `resource_id`, `created_at`
- `notifications`
  - `id` uuid PK
  - `tenant_id` uuid → tenants
  - `user_id` uuid → users
  - `type`, `message`, `read_at`, `created_at`

## RLS
- `current_tenant_id()` security definer function scopes tenant access.
- Tenant scoped policies applied to all tenant-owned tables.
- Users table restricted to own profile.
