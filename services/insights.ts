import { createClient } from "@/lib/supabase/server";

export async function getSupplierInsights() {
  const supabase = await createClient();

  const [{ data: suppliers }, { data: scorecards }, { data: certifications }] = await Promise.all([
    supabase
      .from("suppliers")
      .select("id,name,category,location,risk_score,created_at"),
    supabase
      .from("supplier_scorecards")
      .select("supplier_id,overall_score,created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("certifications")
      .select("supplier_id,expires_at")
  ]);

  const latestScoreBySupplier = new Map<string, { overall: number; created_at: string }>();
  (scorecards ?? []).forEach((score) => {
    if (!latestScoreBySupplier.has(score.supplier_id)) {
      latestScoreBySupplier.set(score.supplier_id, {
        overall: score.overall_score ?? 0,
        created_at: score.created_at
      });
    }
  });

  const expiringCerts = new Map<string, number>();
  const threshold = Date.now() + 1000 * 60 * 60 * 24 * 30;
  (certifications ?? []).forEach((cert) => {
    if (new Date(cert.expires_at).getTime() <= threshold) {
      expiringCerts.set(cert.supplier_id, (expiringCerts.get(cert.supplier_id) ?? 0) + 1);
    }
  });

  const enriched = (suppliers ?? []).map((supplier) => {
    const score = latestScoreBySupplier.get(supplier.id);
    return {
      ...supplier,
      overall_score: score?.overall ?? 0,
      scorecard_date: score?.created_at ?? null,
      expiring_certs: expiringCerts.get(supplier.id) ?? 0
    };
  });

  const topSuppliers = [...enriched]
    .sort((a, b) => b.overall_score - a.overall_score)
    .slice(0, 5);

  const riskySuppliers = [...enriched]
    .sort((a, b) => (b.risk_score + b.expiring_certs * 5) - (a.risk_score + a.expiring_certs * 5))
    .slice(0, 5);

  const averageScore = enriched.length
    ? Math.round(enriched.reduce((sum, s) => sum + s.overall_score, 0) / enriched.length)
    : 0;

  const highRiskCount = enriched.filter((s) => s.risk_score >= 70).length;
  const expiringCount = enriched.filter((s) => s.expiring_certs > 0).length;

  return {
    topSuppliers,
    riskySuppliers,
    averageScore,
    highRiskCount,
    expiringCount
  };
}
