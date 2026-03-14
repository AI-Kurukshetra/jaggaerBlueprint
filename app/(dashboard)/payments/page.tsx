import { CreditCard } from "lucide-react";
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
import { getPayments } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Payments"
};

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Payment Processing"
        description="Track payment runs and reconciliation status."
      />
      <Card className="p-6">
        {payments.length === 0 ? (
          <EmptyState
            title="No payments processed"
            description="Payments will appear after invoice approvals."
            icon={<CreditCard className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Processed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {payment.invoice?.invoice_number ?? "Invoice"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "completed" ? "success" : "warning"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.currency} {Number(payment.amount).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell>{payment.provider ?? "-"}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {payment.processed_at ?? "Pending"}
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
