import { Receipt } from "lucide-react";
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
import { getInvoices } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Invoices"
};

const statusTone: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  paid: "success",
  approved: "info",
  pending: "warning",
  disputed: "danger",
  draft: "neutral"
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Invoice Processing & Matching"
        description="Match invoices with purchase orders and receipts."
      />
      <Card className="p-6">
        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices uploaded"
            description="Invoices will appear here once submitted by suppliers."
            icon={<Receipt className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Matching</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {invoice.invoice_number ?? "Draft"}
                  </TableCell>
                  <TableCell>{invoice.supplier?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={statusTone[invoice.status] ?? "neutral"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={invoice.matching_status === "Matched" ? "success" : "info"}>
                      {invoice.matching_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.currency} {Number(invoice.total_amount).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {invoice.due_date ?? "-"}
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
