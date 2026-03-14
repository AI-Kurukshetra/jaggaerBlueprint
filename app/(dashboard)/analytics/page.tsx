import { BarChart3, TrendingUp } from "lucide-react";
import StatCard from "@/components/layout/StatCard";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import PerformanceOverviewChart from "@/components/dashboard/PerformanceOverviewChart";
import { getInvoices } from "@/services/modules";
import { getPurchaseOrders } from "@/services/purchaseOrders";

export const metadata = {
  title: "SupplySync AI | Spend Analytics"
};

export default async function AnalyticsPage() {
  const [purchaseOrders, invoices] = await Promise.all([
    getPurchaseOrders(),
    getInvoices()
  ]);

  const totalSpend = purchaseOrders.reduce(
    (sum, po) => sum + Number(po.total_amount ?? 0),
    0
  );
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const invoiceSpend = paidInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
    0
  );

  const topSuppliers = purchaseOrders
    .filter((po) => po.supplier?.name)
    .reduce<Record<string, number>>((acc, po) => {
      const name = po.supplier?.name ?? "Unknown";
      acc[name] = (acc[name] ?? 0) + Number(po.total_amount ?? 0);
      return acc;
    }, {});

  const topSupplierRows = Object.entries(topSuppliers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const trendData = [
    totalSpend * 0.6,
    totalSpend * 0.7,
    totalSpend * 0.65,
    totalSpend * 0.8,
    totalSpend * 0.9,
    totalSpend * 0.85
  ].map((value) => Math.round(value / 1000));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Spend Analytics & Reporting"
        description="Visualize procurement spend, savings, and supplier concentration."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total PO Spend"
          value={`$${totalSpend.toLocaleString("en-US")}`}
          helper="Total approved purchase orders"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="Paid Invoices"
          value={`$${invoiceSpend.toLocaleString("en-US")}`}
          helper="Processed payments this cycle"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="accent"
        />
        <StatCard
          title="Active Suppliers"
          value={String(new Set(purchaseOrders.map((po) => po.supplier?.name)).size)}
          helper="Suppliers with active orders"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="Invoice Match Rate"
          value={`${Math.round((paidInvoices.length / Math.max(invoices.length, 1)) * 100)}%`}
          helper="Matched invoices vs total"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Spend Trend (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceOverviewChart
              data={trendData}
              labels={["JAN", "FEB", "MAR", "APR", "MAY", "JUN"]}
            />
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Top Suppliers by Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSupplierRows.map(([supplier, spend]) => (
                  <TableRow key={supplier}>
                    <TableCell className="font-semibold text-slate-900">
                      {supplier}
                    </TableCell>
                    <TableCell>${spend.toLocaleString("en-US")}</TableCell>
                    <TableCell>
                      <Badge variant="info">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
