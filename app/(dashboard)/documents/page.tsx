import { FolderOpen, ShieldCheck, Users } from "lucide-react";
import StatCard from "@/components/layout/StatCard";
import ModuleHeader from "@/components/modules/ModuleHeader";
import DocumentsTable from "@/components/documents/DocumentsTable";
import { Card } from "@/components/ui/Card";
import { getDocuments } from "@/services/modules";
import { getSuppliers } from "@/services/suppliers";

export const metadata = {
  title: "SupplySync AI | Documents"
};

const EXPIRY_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

export default async function DocumentsPage() {
  const [documents, suppliers] = await Promise.all([getDocuments(), getSuppliers()]);
  const supplierLookup = Object.fromEntries(
    suppliers.map((supplier) => [supplier.id, supplier.name])
  );

  const expiringDocuments = documents.filter((doc) => {
    if (!doc.expires_at) {
      return false;
    }
    return new Date(doc.expires_at).getTime() <= Date.now() + EXPIRY_WINDOW_MS;
  }).length;
  const uniqueSuppliers = new Set(documents.map((doc) => doc.supplier_id)).size;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Document Management"
        description="Central repository for supplier documents and versions."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Documents"
          value={String(documents.length)}
          helper="Uploads stored in Supabase Storage"
          icon={<FolderOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Expiring Soon"
          value={String(expiringDocuments)}
          helper="Expires within 30 days"
          icon={<ShieldCheck className="h-5 w-5" />}
          tone="accent"
        />
        <StatCard
          title="Suppliers Covered"
          value={String(uniqueSuppliers)}
          helper="Suppliers with uploaded documents"
          icon={<Users className="h-5 w-5" />}
        />
      </section>

      <Card className="p-6">
        <DocumentsTable documents={documents} supplierLookup={supplierLookup} />
      </Card>
    </div>
  );
}
