import { createClient } from "@/lib/supabase/server";
import type { PurchaseOrderListItem } from "@/types/supabase";

export async function getPurchaseOrders(): Promise<PurchaseOrderListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("id,po_number,status,total_amount,currency,created_at,supplier:suppliers(name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const supplier = Array.isArray(row.supplier) ? row.supplier[0] ?? null : row.supplier;
    return {
      ...row,
      supplier
    };
  });
}
