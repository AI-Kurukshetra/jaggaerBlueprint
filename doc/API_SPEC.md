# SupplySync AI — API Spec (Draft)

## Conventions
- Auth via Supabase session.
- Mutations via Server Actions; complex flows via `/app/api/*`.
- All routes tenant-scoped.
- Approval and workflow actions are audited.

## Endpoint Groups
- `/auth`
- `/users`
- `/suppliers`
- `/contracts`
- `/purchase-orders`
- `/invoices`
- `/products`
- `/approvals`
- `/workflows`
- `/rfqs`
- `/bids`
- `/performance`
- `/risk`
- `/documents`
- `/payments`
- `/analytics`
- `/notifications`
- `/budgets`
- `/catalogs`
- `/compliance`
- `/reports`

## Example Endpoints (Representative)
### Suppliers
- `GET /api/suppliers`
- `POST /api/suppliers`
- `GET /api/suppliers/:id`
- `PATCH /api/suppliers/:id`
- `DELETE /api/suppliers/:id`

### Onboarding
- `POST /api/onboarding/flows`
- `GET /api/onboarding/flows`
- `POST /api/onboarding/submit`

### Purchase Orders
- `GET /api/purchase-orders`
- `POST /api/purchase-orders`
- `PATCH /api/purchase-orders/:id/status`

### Contracts
- `GET /api/contracts`
- `POST /api/contracts`
- `PATCH /api/contracts/:id/renew`

### Invoices
- `GET /api/invoices`
- `POST /api/invoices`
- `POST /api/invoices/:id/match`

### RFQ / Bids
- `POST /api/rfqs`
- `POST /api/rfqs/:id/bids`
- `GET /api/rfqs/:id/compare`

### Approvals & Workflows
- `POST /api/workflows`
- `POST /api/approvals/:id/approve`
- `POST /api/approvals/:id/reject`

### Performance / Risk
- `GET /api/performance/scorecards`
- `POST /api/performance/metrics`
- `GET /api/risk/assessments`

### Analytics
- `GET /api/analytics/spend`
- `GET /api/analytics/performance`

### Documents
- `POST /api/documents/upload`
- `GET /api/documents`

### Payments
- `POST /api/payments/process`
- `GET /api/payments/reconcile`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications/ack`
