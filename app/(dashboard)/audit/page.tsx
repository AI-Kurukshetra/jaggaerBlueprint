import { ClipboardCheck } from "lucide-react";
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
import { getAuditLogs } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Audit Logs"
};

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Audit Trail & Logging"
        description="Complete activity logging for compliance audits."
      />
      <Card className="p-6">
        {logs.length === 0 ? (
          <EmptyState
            title="No audit activity"
            description="Audit entries will appear as actions occur."
            icon={<ClipboardCheck className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {log.action}
                  </TableCell>
                  <TableCell>{log.resource_type}</TableCell>
                  <TableCell>{log.actor?.email ?? "System"}</TableCell>
                  <TableCell>
                    <Badge variant="neutral">
                      {new Date(log.created_at).toLocaleString("en-US")}
                    </Badge>
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
