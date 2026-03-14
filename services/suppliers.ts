import { createClient } from "@/lib/supabase/server";
import type { Supplier, SupplierCertification } from "@/types/supabase";

export async function getDashboardMetrics() {
  const supabase = await createClient();

  const [{ count: suppliersCount }, { count: expiringCount }, { count: attentionCount }, { data: scorecards }] =
    await Promise.all([
      supabase.from("suppliers").select("id", { count: "exact", head: true }),
      supabase
        .from("certifications")
        .select("id", { count: "exact", head: true })
        .lte("expires_at", new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()),
      supabase
        .from("suppliers")
        .select("id", { count: "exact", head: true })
        .gte("risk_score", 70),
      supabase.from("supplier_scorecards").select("overall_score")
    ]);

  const averageScore = scorecards?.length
    ? Math.round(scorecards.reduce((sum, row) => sum + (row.overall_score ?? 0), 0) / scorecards.length)
    : 0;

  return {
    totalSuppliers: suppliersCount ?? 0,
    expiringCertifications: expiringCount ?? 0,
    suppliersNeedingAttention: attentionCount ?? 0,
    performanceSummary: averageScore
  };
}

export async function getSuppliers(search?: string): Promise<Supplier[]> {
  const supabase = await createClient();
  let query = supabase
    .from("suppliers")
    .select(
      "id,name,category,email,phone,location,risk_score,country,contact_email,status,created_at"
    )
    .order("created_at", { ascending: false });

  const term = search?.trim();
  if (term) {
    const pattern = `%${term}%`;
    query = query.or(
      `name.ilike.${pattern},category.ilike.${pattern},country.ilike.${pattern},contact_email.ilike.${pattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getSupplierById(id: string) {
  const supabase = await createClient();

  const [{ data: supplier }, { data: documents }, { data: certifications }, { data: scorecards }] =
    await Promise.all([
      supabase
        .from("suppliers")
        .select("id,name,category,email,phone,location,risk_score,created_at,country,contact_email,status")
        .eq("id", id)
        .single(),
      supabase
        .from("documents")
        .select("id,document_type,file_name,file_path,expires_at,created_at")
        .eq("supplier_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("certifications")
        .select("id,name,issuer,expires_at,created_at")
        .eq("supplier_id", id)
        .order("expires_at", { ascending: true }),
      supabase
        .from("supplier_scorecards")
        .select("id,delivery_score,quality_score,service_score,overall_score,created_at")
        .eq("supplier_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    ]);

  return {
    supplier,
    documents: documents ?? [],
    certifications: certifications ?? [],
    scorecard: scorecards
  };
}

export async function getCertifications(): Promise<(SupplierCertification & { supplier?: { id: string; name: string } | null })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("id,name,issuer,expires_at,created_at,supplier:suppliers(id,name),supplier_id")
    .order("expires_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return rows.map((row: Record<string, unknown>) => {
    const supplier = row.supplier;
    const normalized = Array.isArray(supplier) ? supplier[0] ?? null : supplier ?? null;
    return {
      ...row,
      supplier: normalized as { id: string; name: string } | null
    };
  }) as (SupplierCertification & { supplier?: { id: string; name: string } | null })[];
}

export type ScorecardWithSupplier = {
  id: string;
  supplier_id: string;
  delivery_score: number;
  quality_score: number;
  service_score: number;
  overall_score: number;
  created_at: string;
  supplier?: { id: string; name: string } | null;
};

export async function getScorecards(): Promise<ScorecardWithSupplier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplier_scorecards")
    .select("id,supplier_id,delivery_score,quality_score,service_score,overall_score,created_at,supplier:suppliers(id,name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return rows.map((row: Record<string, unknown>) => {
    const supplier = row.supplier;
    const normalized = Array.isArray(supplier) ? supplier[0] ?? null : supplier ?? null;
    return {
      ...row,
      supplier: normalized as { id: string; name: string } | null
    };
  }) as ScorecardWithSupplier[];
}
