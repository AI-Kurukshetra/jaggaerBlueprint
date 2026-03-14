import { Wallet } from "lucide-react";
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
import { getBudgets } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Budgets"
};

export default async function BudgetsPage() {
  const budgets = await getBudgets();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Budget Management"
        description="Monitor department budgets and spending controls."
      />
      <Card className="p-6">
        {budgets.length === 0 ? (
          <EmptyState
            title="No budgets configured"
            description="Create budgets to track spend by department."
            icon={<Wallet className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {budget.department?.name ?? "General"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {budget.period_start} → {budget.period_end}
                  </TableCell>
                  <TableCell>
                    {budget.currency} {Number(budget.amount).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">On Track</Badge>
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
