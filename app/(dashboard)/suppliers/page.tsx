import Link from "next/link";
import QuickAddModal from "@/components/suppliers/QuickAddModal";
import SupplierSearchView from "@/components/suppliers/SupplierSearchView";
import { Card } from "@/components/ui/Card";
import { getSuppliers } from "@/services/suppliers";
import { createSupplier } from "@/app/(dashboard)/suppliers/actions";

export const metadata = {
  title: "SupplySync AI | Suppliers"
};

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Suppliers</h2>
          <p className="text-sm text-slate-500">
            Manage profiles, risk, and compliance status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <QuickAddModal action={createSupplier} />
          <Link
            href="/suppliers/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Add Supplier
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <SupplierSearchView initialSuppliers={suppliers} />
      </Card>
    </div>
  );
}
