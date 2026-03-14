import { ClipboardList } from "lucide-react";
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
import { getRfqs } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | RFQs"
};

export default async function RfqsPage() {
  const rfqs = await getRfqs();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="RFQ/RFP Management"
        description="Create RFQs, track bids, and compare supplier proposals."
      />
      <Card className="p-6">
        {rfqs.length === 0 ? (
          <EmptyState
            title="No RFQs created"
            description="Publish an RFQ to begin collecting supplier bids."
            icon={<ClipboardList className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bids</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {rfq.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rfq.status === "open" ? "success" : "neutral"}>
                      {rfq.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{rfq.bids_count}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {rfq.due_date ?? "-"}
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
