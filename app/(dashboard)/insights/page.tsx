import { AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import StatCard from "@/components/layout/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSupplierInsights } from "@/services/insights";

export const metadata = {
  title: "SupplySync AI | AI Insights"
};

export default async function InsightsPage() {
  const insights = await getSupplierInsights();

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              AI Insights
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Supplier Performance Signals
            </h2>
            <p className="text-sm text-slate-500">
              Prioritize top performers and surface suppliers requiring immediate action.
            </p>
          </div>
          <Badge variant="info">Updated now</Badge>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Avg Performance"
          value={`${insights.averageScore}%`}
          helper="Across all active scorecards"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="High Risk"
          value={String(insights.highRiskCount)}
          helper="Suppliers with 70+ risk score"
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="accent"
        />
        <StatCard
          title="Expiring Certs"
          value={String(insights.expiringCount)}
          helper="Suppliers with certs expiring in 30 days"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
            <p className="text-sm text-slate-500">
              Highest overall scorecards this period.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.topSuppliers.length === 0 ? (
              <EmptyState
                title="No scorecards yet"
                description="Add scorecards to see top supplier rankings."
              />
            ) : (
              insights.topSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {supplier.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {supplier.category} • {supplier.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">
                      {supplier.overall_score}%
                    </p>
                    <p className="text-xs text-emerald-600">Performance</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Risky Suppliers</CardTitle>
            <p className="text-sm text-slate-500">
              High risk score or expiring certifications.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.riskySuppliers.length === 0 ? (
              <EmptyState
                title="No high-risk suppliers"
                description="Risk monitoring is stable for now."
              />
            ) : (
              insights.riskySuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {supplier.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {supplier.category} • {supplier.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">
                      {supplier.risk_score}
                    </p>
                    <p className="text-xs text-amber-700">Risk score</p>
                    {supplier.expiring_certs > 0 ? (
                      <p className="text-[11px] text-amber-700">
                        {supplier.expiring_certs} expiring
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
