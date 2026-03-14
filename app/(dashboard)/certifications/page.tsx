import { BadgeCheck, Clock4, ShieldCheck } from "lucide-react";
import ModuleHeader from "@/components/modules/ModuleHeader";
import StatCard from "@/components/layout/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCertifications } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Certifications"
};

const EXPIRY_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

export default async function CertificationsPage() {
  const certifications = await getCertifications();
  const now = Date.now();
  const expiryThreshold = now + EXPIRY_WINDOW_MS;
  const expiringCount = certifications.filter((cert) => {
    if (!cert.expires_at) {
      return false;
    }
    return new Date(cert.expires_at).getTime() <= expiryThreshold;
  }).length;

  const hasCertifications = certifications.length > 0;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Certifications"
        description="Track supplier certifications and monitor expiry risk in real time."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tracked certifications"
          value={String(certifications.length)}
          helper="Total records in the compliance vault"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <StatCard
          title="Expiring soon"
          value={String(expiringCount)}
          helper="Within 30 days of expiry"
          icon={<Clock4 className="h-5 w-5" />}
          tone="accent"
        />
        <StatCard
          title="Compliance ready"
          value={hasCertifications ? "Live" : "Idle"}
          helper="Suppliers with active coverage"
          icon={<BadgeCheck className="h-5 w-5" />}
        />
      </section>

      <Card className="p-6">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Certification inventory</CardTitle>
          <p className="text-sm text-slate-500">
            Sorted by expiry date so you can renew on time.
          </p>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <EmptyState
              title="No certifications tracked"
              description="Add certifications from supplier profiles to monitor expiry risk."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => {
                  const supplierName = cert.supplier?.name ?? "Unknown";
                  const expiresAt = cert.expires_at ? new Date(cert.expires_at) : null;
                  const expiresText = expiresAt
                    ? expiresAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    : "No expiry";

                  const isExpired = expiresAt ? expiresAt.getTime() < now : false;
                  const isExpiring = expiresAt
                    ? expiresAt.getTime() <= expiryThreshold && !isExpired
                    : false;

                  let statusVariant: Parameters<typeof Badge>[0]["variant"] = "success";
                  let statusLabel = "Active";

                  if (isExpired) {
                    statusVariant = "danger";
                    statusLabel = "Expired";
                  } else if (isExpiring) {
                    statusVariant = "warning";
                    statusLabel = "Expiring soon";
                  } else if (!expiresAt) {
                    statusVariant = "neutral";
                    statusLabel = "No expiry";
                  }

                  return (
                    <TableRow key={cert.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {supplierName}
                      </TableCell>
                      <TableCell>{cert.name}</TableCell>
                      <TableCell>{cert.issuer ?? "—"}</TableCell>
                      <TableCell>{expiresText}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{statusLabel}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
