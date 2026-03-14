import { BadgeCheck, Clock4, ShieldCheck } from "lucide-react";
import StatCard from "@/components/layout/StatCard";
import ModuleHeader from "@/components/modules/ModuleHeader";
import ComplianceTable from "@/components/compliance/ComplianceTable";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { getComplianceRecords } from "@/services/modules";
import { getCertifications, getSuppliers } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Compliance"
};

const EXPIRY_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

export default async function CompliancePage() {
  const [records, certifications, suppliers] = await Promise.all([
    getComplianceRecords(),
    getCertifications(),
    getSuppliers()
  ]);
  const supplierLookup = Object.fromEntries(
    suppliers.map((supplier) => [supplier.id, supplier.name])
  );

  const approvedCount = records.filter((record) => record.status === "approved").length;
  const expiringCertifications = certifications.filter((cert) => {
    if (!cert.expires_at) {
      return false;
    }
    return new Date(cert.expires_at).getTime() <= Date.now() + EXPIRY_WINDOW_MS;
  }).length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Compliance Tracking"
        description="Monitor regulatory adherence, certifications, and policy reviews."
      />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Compliance Reviews"
          value={String(records.length)}
          helper="Active policies tracked this quarter"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <StatCard
          title="Approved Policies"
          value={String(approvedCount)}
          helper="Signed off in your approval workflow"
          icon={<BadgeCheck className="h-5 w-5" />}
          tone="accent"
        />
        <StatCard
          title="Expiring Certifications"
          value={String(expiringCertifications)}
          helper="Within 30 days"
          icon={<Clock4 className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Compliance Reviews</CardTitle>
            <p className="text-sm text-slate-500">
              Filter by status or search for specific policies.
            </p>
          </CardHeader>
          <CardContent>
            <ComplianceTable records={records} supplierLookup={supplierLookup} />
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Certification Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            {certifications.length === 0 ? (
              <EmptyState
                title="No certifications"
                description="Upload certifications to track compliance."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certifications.slice(0, 6).map((cert) => {
                    const supplierName = cert.supplier?.name ?? supplierLookup[cert.supplier_id] ?? "Unknown";
                    const isExpiring =
                      cert.expires_at &&
                      new Date(cert.expires_at).getTime() <= Date.now() + EXPIRY_WINDOW_MS;
                    return (
                      <TableRow key={cert.id}>
                        <TableCell className="font-semibold text-slate-900">
                          {supplierName}
                        </TableCell>
                        <TableCell>{cert.name}</TableCell>
                        <TableCell>
                          {cert.expires_at ? (
                            <Badge variant={isExpiring ? "warning" : "info"}>
                              {new Date(cert.expires_at).toLocaleDateString("en-US")}
                            </Badge>
                          ) : (
                            <Badge variant="neutral">No expiry</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
