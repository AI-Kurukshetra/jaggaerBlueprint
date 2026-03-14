import { ClipboardCheck, LineChart, ThumbsUp } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import StatCard from "@/components/layout/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { getScorecards } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Scorecards"
};

export default async function ScorecardsPage() {
  const scorecards = await getScorecards();
  const hasScorecards = scorecards.length > 0;
  const overallAvg =
    scorecards.length === 0
      ? 0
      : Math.round(scorecards.reduce((sum, row) => sum + (row.overall_score ?? 0), 0) / scorecards.length);
  const latestScorecards = scorecards.slice(0, 4);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Scorecards"
        description="Monitor supplier performance across delivery, quality, and service."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Average score"
          value={`${overallAvg}%`}
          helper="Based on latest scorecards"
          icon={<LineChart className="h-5 w-5" />}
        />
        <StatCard
          title="Scorecards logged"
          value={String(scorecards.length)}
          helper="Total records in the history"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatCard
          title="On-target suppliers"
          value={String(scorecards.filter((row) => (row.overall_score ?? 0) >= 80).length)}
          helper="Overall score ≥ 80%"
          icon={<ThumbsUp className="h-5 w-5" />}
        />
      </section>

      <Card className="p-6">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Latest scorecards</CardTitle>
          <p className="text-sm text-slate-500">
            Based on the most recent assessments across all suppliers.
          </p>
        </CardHeader>
        <CardContent>
          {!hasScorecards ? (
            <EmptyState
              title="No scorecards available"
              description="Add a scorecard from a supplier profile to start tracking performance."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestScorecards.map((score) => {
                  const supplierName = score.supplier?.name ?? "Unknown";
                  const overall = score.overall_score ?? 0;
                  const statusVariant: Parameters<typeof Badge>[0]["variant"] =
                    overall >= 80 ? "success" : overall >= 60 ? "warning" : "danger";
                  return (
                    <TableRow key={score.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {supplierName}
                      </TableCell>
                      <TableCell>{score.delivery_score ?? "—"}%</TableCell>
                      <TableCell>{score.quality_score ?? "—"}%</TableCell>
                      <TableCell>{score.service_score ?? "—"}%</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{overall}%</Badge>
                      </TableCell>
                      <TableCell>
                        {score.created_at
                          ? new Date(score.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })
                          : "Pending"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
