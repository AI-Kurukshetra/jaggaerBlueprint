import { CheckCircle2 } from "lucide-react";
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
import { getApprovals, getWorkflows } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Approvals"
};

export default async function ApprovalsPage() {
  const [approvals, workflows] = await Promise.all([
    getApprovals(),
    getWorkflows()
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Approval Workflows"
        description="Multi-level approvals with escalation and audit trails."
      />
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Workflows</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {workflows.length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Configured approval flows.</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending Approvals</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {approvals.filter((approval) => approval.status === "pending").length}
          </p>
          <p className="mt-2 text-sm text-slate-500">Awaiting decision.</p>
        </Card>
      </section>
      <Card className="p-6">
        {approvals.length === 0 ? (
          <EmptyState
            title="No approval requests"
            description="Requests will appear here once workflows are triggered."
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {approval.resource_type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={approval.status === "approved" ? "success" : "warning"}>
                      {approval.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{approval.step_count} steps</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(approval.created_at).toLocaleDateString("en-US")}
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
