import SupplierForm from "@/components/suppliers/SupplierForm";
import { Card } from "@/components/ui/Card";
import { createSupplier } from "@/app/(dashboard)/suppliers/actions";

export const metadata = {
  title: "SupplySync AI | New Supplier"
};

export default function NewSupplierPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Add Supplier</h2>
        <p className="text-sm text-slate-500">
          Capture the essentials and start onboarding.
        </p>
      </div>
      <Card className="p-6">
        <SupplierForm action={createSupplier} submitLabel="Create Supplier" />
      </Card>
    </div>
  );
}
