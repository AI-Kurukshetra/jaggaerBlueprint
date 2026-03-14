import { FileSignature } from "lucide-react";
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
import { getContracts } from "@/services/modules";

export const metadata = {
  title: "SupplySync AI | Contracts"
};

export default async function ContractsPage() {
  const contracts = await getContracts();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Contract Lifecycle Management"
        description="Track contract status, renewal dates, and supplier obligations."
      />
      <Card className="p-6">
        {contracts.length === 0 ? (
          <EmptyState
            title="No contracts yet"
            description="Add supplier contracts to monitor renewal timelines."
            icon={<FileSignature className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Renewal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {contract.title}
                  </TableCell>
                  <TableCell>{contract.supplier?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={contract.status === "active" ? "success" : "neutral"}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contract.value
                      ? `${contract.currency ?? "USD"} ${Number(contract.value).toLocaleString("en-US")}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {contract.renewal_date ?? "-"}
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
