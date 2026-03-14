import { ShieldAlert } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { getRiskAssessments } from "@/services/modules";
import { getSuppliers } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Supplier Risk"
};

const toneMap: Record<string, "success" | "warning" | "danger" | "info"> = {
  low: "success",
  medium: "info",
  high: "warning",
  critical: "danger"
};

export default async function RiskPage() {
  const [assessments, suppliers] = await Promise.all([
    getRiskAssessments(),
    getSuppliers()
  ]);
  const supplierLookup = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Supplier Risk Assessment"
        description="Track financial stability, compliance health, and operational exposure."
      />
      <Card className="p-6">
        {assessments.length === 0 ? (
          <EmptyState
            title="No risk assessments"
            description="Risk assessments will appear once suppliers are evaluated."
            icon={<ShieldAlert className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Assessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {supplierLookup.get(assessment.supplier_id) ?? "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={toneMap[assessment.risk_level] ?? "info"}>
                      {assessment.risk_level}
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.risk_score}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {assessment.summary ?? "-"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(assessment.assessed_at).toLocaleDateString("en-US")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
