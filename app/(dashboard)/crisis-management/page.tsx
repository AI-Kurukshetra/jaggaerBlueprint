import { AlertOctagon } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";

export const metadata = {
  title: "SupplySync AI | Crisis & Continuity"
};

// Dummy data for testing — replace with real API when crisis management is built
const DUMMY_SCENARIOS = [
  { id: "S1", name: "Primary supplier disruption", status: "active" as const, backupSupplier: "Backup Logistics Co", lastTested: "2025-12-01" },
  { id: "S2", name: "Natural disaster (region)", status: "draft" as const, backupSupplier: "EuroChem Backup", lastTested: "—" },
  { id: "S3", name: "Cyber / IT outage", status: "active" as const, backupSupplier: "CloudFailover Inc", lastTested: "2026-01-15" },
  { id: "S4", name: "Raw material shortage", status: "active" as const, backupSupplier: "Alternate Raw Materials", lastTested: "2025-11-20" },
  { id: "S5", name: "Port / logistics strike", status: "pending" as const, backupSupplier: "Air Freight Partner", lastTested: "—" },
];

const DUMMY_CONTINGENCY = [
  { primary: "Acme Raw Materials", backup: "Reserve Source A", category: "Raw Materials", leadTimeDays: 7 },
  { primary: "Global Logistics Co", backup: "Regional Carrier B", category: "Logistics", leadTimeDays: 3 },
  { primary: "Pacific Components", backup: "Domestic Components Inc", category: "Electronics", leadTimeDays: 14 },
];

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  active: "success",
  draft: "neutral",
  pending: "warning",
};

export default function CrisisManagementPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Crisis Management & Continuity Planning"
        description="Scenario planning and contingency supplier activation for business continuity."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Scenarios</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{DUMMY_SCENARIOS.length}</p>
          <p className="mt-2 text-sm text-slate-500">Dummy data for testing</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active plans</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_SCENARIOS.filter((s) => s.status === "active").length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Ready for activation</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Backup suppliers</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{DUMMY_CONTINGENCY.length}</p>
          <p className="mt-2 text-sm text-slate-500">Mapped to primaries</p>
        </Card>
      </section>
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Crisis scenarios (dummy data)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Scenario</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Backup supplier</TableHead>
              <TableHead>Last tested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_SCENARIOS.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono">{row.id}</TableCell>
                <TableCell className="font-semibold text-slate-900">{row.name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[row.status] ?? "neutral"}>{row.status}</Badge>
                </TableCell>
                <TableCell>{row.backupSupplier}</TableCell>
                <TableCell className="text-sm text-slate-600">{row.lastTested}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Contingency supplier mapping (dummy data)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Primary supplier</TableHead>
              <TableHead>Backup supplier</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Lead time (days)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_CONTINGENCY.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold text-slate-900">{row.primary}</TableCell>
                <TableCell>{row.backup}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.leadTimeDays}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
