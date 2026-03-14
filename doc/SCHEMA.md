# Schema Notes

## Core Tables (Planned)
- tenants
- users
- suppliers
- supplier_contacts
- documents
- certifications
- supplier_scorecards
- activity_logs
- supplier_risk_assessments
- compliance_records
- supplier_diversity_profiles
- supplier_catalogs
- products
- product_categories
- purchase_orders
- purchase_order_items
- goods_receipts
- invoices
- invoice_items
- contracts
- contract_versions
- rfqs
- rfq_items
- bids
- bid_items
- approvals
- approval_steps
- workflows
- workflow_steps
- performance_metrics
- risk_models
- payments
- budgets
- departments
- audit_logs
- notifications
- exchange_rates

## RLS
- `current_tenant_id()` security definer function scopes queries.
- Users can only see their own user row.
- All tenant-owned tables must include `tenant_id` and be scoped by RLS policies.

## Storage
- Bucket: supplier-documents (private)
- Policies validate supplier ownership and tenant scoping.
