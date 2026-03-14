import { Boxes } from "lucide-react";
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
  title: "SupplySync AI | Inventory"
};

// Dummy data for testing — replace with real API/DB when inventory integration is built
const DUMMY_INVENTORY = [
  { sku: "SKU-001", name: "Steel Rods 10mm", warehouse: "WH-North", qty: 1250, reorderPoint: 500, status: "in_stock" as const },
  { sku: "SKU-002", name: "Plastic Pellets HDPE", warehouse: "WH-North", qty: 320, reorderPoint: 400, status: "low_stock" as const },
  { sku: "SKU-003", name: "Packaging Boxes 24x18", warehouse: "WH-South", qty: 4200, reorderPoint: 2000, status: "in_stock" as const },
  { sku: "SKU-004", name: "Electronics Module A", warehouse: "WH-East", qty: 85, reorderPoint: 100, status: "reorder" as const },
  { sku: "SKU-005", name: "Chemicals Solvent X", warehouse: "WH-South", qty: 45, reorderPoint: 80, status: "low_stock" as const },
  { sku: "SKU-006", name: "Textile Roll Cotton", warehouse: "WH-North", qty: 0, reorderPoint: 200, status: "out_of_stock" as const },
  { sku: "SKU-007", name: "Fasteners M8", warehouse: "WH-East", qty: 5800, reorderPoint: 1000, status: "in_stock" as const },
  { sku: "SKU-008", name: "Labels Thermal", warehouse: "WH-North", qty: 210, reorderPoint: 300, status: "low_stock" as const },
];

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  in_stock: "success",
  low_stock: "warning",
  reorder: "warning",
  out_of_stock: "danger",
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Inventory Integration"
        description="Connect with inventory management systems to track stock levels and automate reordering."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total SKUs</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{DUMMY_INVENTORY.length}</p>
          <p className="mt-2 text-sm text-slate-500">Dummy data for testing</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Low / Reorder</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_INVENTORY.filter((i) => i.status === "low_stock" || i.status === "reorder").length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Items below reorder point</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Out of Stock</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {DUMMY_INVENTORY.filter((i) => i.status === "out_of_stock").length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Require immediate action</p>
        </Card>
      </section>
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Inventory levels (dummy data)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reorder point</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_INVENTORY.map((row) => (
              <TableRow key={row.sku}>
                <TableCell className="font-mono text-sm">{row.sku}</TableCell>
                <TableCell className="font-semibold text-slate-900">{row.name}</TableCell>
                <TableCell>{row.warehouse}</TableCell>
                <TableCell>{row.qty.toLocaleString()}</TableCell>
                <TableCell>{row.reorderPoint.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[row.status] ?? "neutral"}>
                    {row.status.replace("_", " ")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
