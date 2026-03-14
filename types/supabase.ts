export type Supplier = {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  risk_score: number;
  created_at: string;
  country: string | null;
  contact_email: string | null;
  status: string | null;
};

export type SupplierScorecard = {
  id: string;
  supplier_id: string;
  delivery_score: number;
  quality_score: number;
  service_score: number;
  overall_score: number;
  created_at: string;
};

export type SupplierCertification = {
  id: string;
  supplier_id: string;
  name: string;
  issuer: string;
  expires_at: string;
  created_at: string;
};

export type SupplierDocument = {
  id: string;
  supplier_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  expires_at: string | null;
  created_at: string;
};

export type SupplierRiskAssessment = {
  id: string;
  supplier_id: string;
  risk_score: number;
  risk_level: string;
  summary: string | null;
  assessed_at: string;
};

export type SupplierDiversityProfile = {
  id: string;
  supplier_id: string;
  category: string;
  status: string;
  certifying_body: string | null;
  valid_until: string | null;
  created_at: string;
};

export type SupplierComplianceRecord = {
  id: string;
  supplier_id: string;
  policy_name: string;
  status: string;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type PurchaseOrderListItem = {
  id: string;
  po_number: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  supplier: { name: string } | null;
};

export type ContractListItem = {
  id: string;
  title: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  renewal_date: string | null;
  value: number | null;
  currency: string | null;
  supplier: { name: string } | null;
};

export type InvoiceListItem = {
  id: string;
  invoice_number: string | null;
  status: string;
  total_amount: number;
  currency: string;
  issued_at: string | null;
  due_date: string | null;
  supplier: { name: string } | null;
  matching_status: string;
};

export type PaymentListItem = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  processed_at: string | null;
  provider: string | null;
  reference: string | null;
  invoice: { invoice_number: string | null } | null;
};

export type WorkflowListItem = {
  id: string;
  name: string;
  resource_type: string;
  status: string;
};

export type ApprovalListItem = {
  id: string;
  resource_type: string;
  resource_id: string;
  status: string;
  created_at: string;
  step_count: number;
};

export type RfqListItem = {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  bids_count: number;
};

export type CatalogListItem = {
  id: string;
  name: string;
  status: string;
  supplier: { name: string } | null;
  products_count: number;
};

export type ProductListItem = {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  currency: string | null;
  availability: string | null;
  catalog: { name: string } | null;
};

export type BudgetListItem = {
  id: string;
  period_start: string;
  period_end: string;
  amount: number;
  currency: string;
  department: { name: string } | null;
};

export type DepartmentListItem = {
  id: string;
  name: string;
};

export type AuditLogListItem = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string;
  actor: { email: string | null } | null;
};

export type NotificationListItem = {
  id: string;
  type: string;
  message: string;
  read_at: string | null;
  created_at: string;
};

export type ExchangeRateListItem = {
  id: string;
  base_currency: string;
  quote_currency: string;
  rate: number;
  as_of: string;
};

export type UserListItem = {
  id: string;
  email: string | null;
  role: string | null;
  status: string | null;
};
