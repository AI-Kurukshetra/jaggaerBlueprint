import { Users } from "lucide-react";
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
import { getSupplierDiversityProfiles } from "@/services/modules";
import { getSuppliers } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Supplier Diversity"
};

export default async function DiversityPage() {
  const [profiles, suppliers] = await Promise.all([
    getSupplierDiversityProfiles(),
    getSuppliers()
  ]);
  const supplierLookup = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Supplier Diversity Tracking"
        description="Monitor diverse supplier engagement for compliance and reporting."
      />
      <Card className="p-6">
        {profiles.length === 0 ? (
          <EmptyState
            title="No diversity profiles"
            description="Add diversity profiles to track supplier participation."
            icon={<Users className="h-5 w-5" />}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {supplierLookup.get(profile.supplier_id) ?? "Unknown"}
                  </TableCell>
                  <TableCell>{profile.category}</TableCell>
                  <TableCell>
                    <Badge variant={profile.status === "verified" ? "success" : "warning"}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {profile.valid_until ?? "-"}
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
