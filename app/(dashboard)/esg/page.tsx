import { Leaf } from "lucide-react";
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
  title: "SupplySync AI | ESG Monitoring"
};

// Dummy data for testing — replace with real API when ESG module is built
const DUMMY_ESG = [
  { supplier: "Acme Raw Materials", environmental: 82, social: 78, governance: 88, overall: "A" as const },
  { supplier: "Global Logistics Co", environmental: 65, social: 72, governance: 75, overall: "B" as const },
  { supplier: "Pacific Components", environmental: 70, social: 68, governance: 80, overall: "B" as const },
  { supplier: "EuroChem Supplies", environmental: 58, social: 62, governance: 70, overall: "C" as const },
  { supplier: "PackPro Inc", environmental: 90, social: 85, governance: 88, overall: "A" as const },
  { supplier: "Asia Textiles Ltd", environmental: 52, social: 55, governance: 60, overall: "C" as const },
  { supplier: "MetalWorks International", environmental: 75, social: 80, governance: 82, overall: "B" as const },
  { supplier: "SafeGuard Compliance", environmental: 88, social: 90, governance: 92, overall: "A" as const },
];

const gradeVariant: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  A: "success",
  B: "info",
  C: "warning",
  D: "danger",
};

export default function ESGPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Advanced ESG Monitoring"
        description="Environmental, Social, and Governance tracking with third-party data and sustainability scoring."
      />
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Suppliers scored</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{DUMMY_ESG.length}</p>
          <p className="mt-2 text-sm text-slate-500">Dummy data for testing</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg. Environmental</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {Math.round(DUMMY_ESG.reduce((a, r) => a + r.environmental, 0) / DUMMY_ESG.length)}
          </p>
          <p className="mt-2 text-sm text-slate-500">0–100 score</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg. Social</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {Math.round(DUMMY_ESG.reduce((a, r) => a + r.social, 0) / DUMMY_ESG.length)}
          </p>
          <p className="mt-2 text-sm text-slate-500">0–100 score</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Grade A suppliers</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_ESG.filter((r) => r.overall === "A").length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Top tier</p>
        </Card>
      </section>
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">ESG scores by supplier (dummy data)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Environmental</TableHead>
              <TableHead>Social</TableHead>
              <TableHead>Governance</TableHead>
              <TableHead>Overall grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_ESG.map((row) => (
              <TableRow key={row.supplier}>
                <TableCell className="font-semibold text-slate-900">{row.supplier}</TableCell>
                <TableCell>{row.environmental}</TableCell>
                <TableCell>{row.social}</TableCell>
                <TableCell>{row.governance}</TableCell>
                <TableCell>
                  <Badge variant={gradeVariant[row.overall] ?? "neutral"}>{row.overall}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
