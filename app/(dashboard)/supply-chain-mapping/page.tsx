import { Network } from "lucide-react";
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
  title: "SupplySync AI | Supply Chain Map"
};

// Dummy data for testing — replace with real API when supply chain mapping is built
const DUMMY_TIERS = [
  { tier: 1, supplier: "Acme Raw Materials", category: "Raw Materials", risk: "low" as const, country: "USA" },
  { tier: 1, supplier: "Global Logistics Co", category: "Logistics", risk: "medium" as const, country: "USA" },
  { tier: 2, supplier: "Pacific Components", category: "Electronics", risk: "medium" as const, country: "Taiwan" },
  { tier: 2, supplier: "EuroChem Supplies", category: "Chemicals", risk: "high" as const, country: "Germany" },
  { tier: 1, supplier: "PackPro Inc", category: "Packaging", risk: "low" as const, country: "USA" },
  { tier: 3, supplier: "Asia Textiles Ltd", category: "Textiles", risk: "high" as const, country: "Vietnam" },
  { tier: 2, supplier: "MetalWorks International", category: "Manufacturing", risk: "low" as const, country: "Mexico" },
  { tier: 1, supplier: "SafeGuard Compliance", category: "Safety", risk: "low" as const, country: "USA" },
];

const riskVariant: Record<string, "success" | "warning" | "danger" | "info"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export default function SupplyChainMappingPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Supply Chain Mapping & Visualization"
        description="Interactive view of multi-tier supplier networks with risk propagation analysis."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tier 1 Suppliers</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_TIERS.filter((t) => t.tier === 1).length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Direct suppliers</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tier 2–3</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_TIERS.filter((t) => t.tier > 1).length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Sub-tier network</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">High Risk Nodes</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_TIERS.filter((t) => t.risk === "high").length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Require monitoring</p>
        </Card>
      </section>
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Supply chain nodes (dummy data)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tier</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_TIERS.map((row, i) => (
              <TableRow key={`${row.supplier}-${i}`}>
                <TableCell className="font-semibold">Tier {row.tier}</TableCell>
                <TableCell className="font-semibold text-slate-900">{row.supplier}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>
                  <Badge variant={riskVariant[row.risk] ?? "info"}>{row.risk}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
