import Link from "next/link";
import PurchaseOrderTable from "@/components/purchase-orders/PurchaseOrderTable";
import { getPurchaseOrders } from "@/services/purchaseOrders";

export const metadata = {
  title: "SupplySync AI | Purchase Orders"
};

export default async function PurchaseOrdersPage() {
  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Purchase Orders</h2>
          <p className="text-sm text-slate-500">
            Create, approve, and track orders across your supplier network.
          </p>
        </div>
        <Link
          href="/purchase-orders/new"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft"
        >
          New PO
        </Link>
      </div>

      <section className="card p-6">
        <PurchaseOrderTable purchaseOrders={purchaseOrders} />
      </section>
    </div>
  );
}
