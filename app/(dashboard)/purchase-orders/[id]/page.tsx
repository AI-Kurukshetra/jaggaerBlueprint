import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "SupplySync AI | Purchase Order"
};

export default async function PurchaseOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: purchaseOrder, error } = await supabase
    .from("purchase_orders")
    .select(
      "id,po_number,status,total_amount,currency,created_at,supplier:suppliers(name),items:purchase_order_items(id,description,quantity,unit_price,line_total)"
    )
    .eq("id", id)
    .single();

  const supplier = Array.isArray(purchaseOrder?.supplier)
    ? purchaseOrder?.supplier[0] ?? null
    : purchaseOrder?.supplier ?? null;

  if (error || !purchaseOrder) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Purchase Order</h2>
        <p className="text-sm text-slate-500">Unable to load this purchase order.</p>
        <Link href="/purchase-orders" className="text-sm font-semibold text-brand-600">
          Back to purchase orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Purchase Order</p>
          <h2 className="text-xl font-semibold text-slate-900">{purchaseOrder.po_number}</h2>
          <p className="text-sm text-slate-500">
            Supplier: {supplier?.name ?? "Unassigned"}
          </p>
        </div>
        <Link href="/purchase-orders" className="text-sm font-semibold text-brand-600">
          Back to purchase orders
        </Link>
      </div>

      <section className="card p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-400">Status</p>
            <p className="text-sm font-semibold text-slate-900">{purchaseOrder.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Total</p>
            <p className="text-sm font-semibold text-slate-900">
              {Number(purchaseOrder.total_amount ?? 0).toLocaleString("en-US", {
                style: "currency",
                currency: purchaseOrder.currency ?? "USD"
              })}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Created</p>
            <p className="text-sm font-semibold text-slate-900">
              {new Date(purchaseOrder.created_at).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="text-sm font-semibold text-slate-900">Line Items</h3>
        {purchaseOrder.items?.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.description ?? "Item"}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{Number(item.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No line items yet.</p>
        )}
      </section>
    </div>
  );
}
