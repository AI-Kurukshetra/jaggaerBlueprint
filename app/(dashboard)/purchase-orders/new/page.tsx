import PurchaseOrderForm from "@/components/purchase-orders/PurchaseOrderForm";
import { getSuppliers } from "@/services/suppliers";
import { createPurchaseOrder } from "@/app/(dashboard)/purchase-orders/actions";

export const metadata = {
  title: "SupplySync AI | New Purchase Order"
};

export default async function NewPurchaseOrderPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">New Purchase Order</h2>
        <p className="text-sm text-slate-500">
          Capture supplier, amount, and status to route approvals.
        </p>
      </div>

      <section className="card p-6">
        <PurchaseOrderForm suppliers={suppliers} action={createPurchaseOrder} submitLabel="Create PO" />
      </section>
    </div>
  );
}
