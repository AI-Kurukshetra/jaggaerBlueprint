import { createClient } from "@/lib/supabase/server";
import type {
  ApprovalListItem,
  AuditLogListItem,
  BudgetListItem,
  CatalogListItem,
  ContractListItem,
  ExchangeRateListItem,
  InvoiceListItem,
  NotificationListItem,
  PaymentListItem,
  ProductListItem,
  RfqListItem,
  SupplierComplianceRecord,
  SupplierDocument,
  SupplierDiversityProfile,
  SupplierRiskAssessment,
  UserListItem,
  WorkflowListItem
} from "@/types/supabase";

function mapSingle<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function getContracts(): Promise<ContractListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select(
      "id,title,status,start_date,end_date,renewal_date,value,currency,supplier:suppliers(name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...row,
    supplier: mapSingle(row.supplier)
  }));
}

export async function getInvoices(): Promise<InvoiceListItem[]> {
  const supabase = await createClient();
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(
      "id,invoice_number,status,total_amount,currency,issued_at,due_date,purchase_order_id,supplier:suppliers(name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const poIds = Array.from(
    new Set((invoices ?? []).map((invoice) => invoice.purchase_order_id).filter(Boolean))
  ) as string[];

  const { data: receipts } = await supabase
    .from("goods_receipts")
    .select("purchase_order_id")
    .in("purchase_order_id", poIds);

  const receiptSet = new Set((receipts ?? []).map((receipt) => receipt.purchase_order_id));

  return (invoices ?? []).map((invoice) => {
    const supplier = mapSingle(invoice.supplier);
    const hasReceipt = invoice.purchase_order_id
      ? receiptSet.has(invoice.purchase_order_id)
      : false;
    const matchingStatus = invoice.status === "disputed"
      ? "Exception"
      : invoice.status === "paid"
        ? "Matched"
        : hasReceipt
          ? "Ready"
          : "Pending";
    return {
      ...invoice,
      supplier,
      matching_status: matchingStatus
    };
  });
}

export async function getPayments(): Promise<PaymentListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("id,status,amount,currency,processed_at,provider,reference,invoice:invoices(invoice_number)")
    .order("processed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...row,
    invoice: mapSingle(row.invoice)
  }));
}

export async function getRiskAssessments(): Promise<SupplierRiskAssessment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplier_risk_assessments")
    .select("id,supplier_id,risk_score,risk_level,summary,assessed_at")
    .order("assessed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getComplianceRecords(): Promise<SupplierComplianceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("compliance_records")
    .select("id,supplier_id,policy_name,status,notes,reviewed_at,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getSupplierDiversityProfiles(): Promise<SupplierDiversityProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplier_diversity_profiles")
    .select("id,supplier_id,category,status,certifying_body,valid_until,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getDocuments(): Promise<SupplierDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id,supplier_id,document_type,file_name,file_path,expires_at,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getWorkflows(): Promise<WorkflowListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workflows")
    .select("id,name,resource_type,status")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getApprovals(): Promise<ApprovalListItem[]> {
  const supabase = await createClient();
  const { data: approvals, error } = await supabase
    .from("approvals")
    .select("id,resource_type,resource_id,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const approvalIds = (approvals ?? []).map((approval) => approval.id);
  const { data: steps } = await supabase
    .from("approval_steps")
    .select("approval_id")
    .in("approval_id", approvalIds);

  const stepCount = new Map<string, number>();
  (steps ?? []).forEach((step) => {
    stepCount.set(step.approval_id, (stepCount.get(step.approval_id) ?? 0) + 1);
  });

  return (approvals ?? []).map((approval) => ({
    ...approval,
    step_count: stepCount.get(approval.id) ?? 0
  }));
}

export async function getRfqs(): Promise<RfqListItem[]> {
  const supabase = await createClient();
  const { data: rfqs, error } = await supabase
    .from("rfqs")
    .select("id,title,status,due_date")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rfqIds = (rfqs ?? []).map((rfq) => rfq.id);
  const { data: bids } = await supabase
    .from("bids")
    .select("rfq_id")
    .in("rfq_id", rfqIds);

  const bidCount = new Map<string, number>();
  (bids ?? []).forEach((bid) => {
    bidCount.set(bid.rfq_id, (bidCount.get(bid.rfq_id) ?? 0) + 1);
  });

  return (rfqs ?? []).map((rfq) => ({
    ...rfq,
    bids_count: bidCount.get(rfq.id) ?? 0
  }));
}

export async function getCatalogs(): Promise<CatalogListItem[]> {
  const supabase = await createClient();
  const { data: catalogs, error } = await supabase
    .from("supplier_catalogs")
    .select("id,name,status,supplier:suppliers(name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const catalogIds = (catalogs ?? []).map((catalog) => catalog.id);
  const { data: products } = await supabase
    .from("products")
    .select("catalog_id")
    .in("catalog_id", catalogIds);

  const productCount = new Map<string, number>();
  (products ?? []).forEach((product) => {
    if (product.catalog_id) {
      productCount.set(product.catalog_id, (productCount.get(product.catalog_id) ?? 0) + 1);
    }
  });

  return (catalogs ?? []).map((catalog) => ({
    ...catalog,
    supplier: mapSingle(catalog.supplier),
    products_count: productCount.get(catalog.id) ?? 0
  }));
}

export async function getProducts(): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,sku,price,currency,availability,catalog:supplier_catalogs(name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...row,
    catalog: mapSingle(row.catalog)
  }));
}

export async function getBudgets(): Promise<BudgetListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("id,period_start,period_end,amount,currency,department:departments(name)")
    .order("period_start", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...row,
    department: mapSingle(row.department)
  }));
}

export async function getAuditLogs(): Promise<AuditLogListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,action,resource_type,resource_id,created_at,actor:users(email)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...row,
    actor: mapSingle(row.actor)
  }));
}

export async function getNotifications(): Promise<NotificationListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id,type,message,read_at,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getExchangeRates(): Promise<ExchangeRateListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exchange_rates")
    .select("id,base_currency,quote_currency,rate,as_of")
    .order("as_of", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getUsers(): Promise<UserListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,email,role,status")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
