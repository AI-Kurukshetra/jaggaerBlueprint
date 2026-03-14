import Link from "next/link";
import type { PurchaseOrderListItem } from "@/types/supabase";

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function statusClasses(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "issued":
      return "bg-blue-100 text-blue-700";
    case "closed":
      return "bg-slate-200 text-slate-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function PurchaseOrderTable({
  purchaseOrders
}: {
  purchaseOrders: PurchaseOrderListItem[];
}) {
  if (purchaseOrders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
        No purchase orders yet. Create your first PO to begin procurement.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">PO Number</th>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {purchaseOrders.map((po) => (
            <tr key={po.id} className="text-slate-700">
              <td className="px-4 py-3 font-medium text-slate-900">
                {po.po_number}
              </td>
              <td className="px-4 py-3">
                {po.supplier?.name ?? "Unassigned"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                    po.status
                  )}`}
                >
                  {po.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {formatCurrency(Number(po.total_amount ?? 0), po.currency ?? "USD")}
              </td>
              <td className="px-4 py-3">
                {new Date(po.created_at).toLocaleDateString("en-US")}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/purchase-orders/${po.id}`}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
