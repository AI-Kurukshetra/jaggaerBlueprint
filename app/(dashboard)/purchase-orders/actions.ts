"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { purchaseOrderSchema } from "@/lib/validations/purchase-order";

export async function createPurchaseOrder(formData: FormData) {
  const values = {
    supplier_id: String(formData.get("supplier_id") ?? ""),
    po_number: String(formData.get("po_number") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    total_amount: Number(formData.get("total_amount") ?? 0),
    currency: String(formData.get("currency") ?? "USD").toUpperCase()
  };

  const parsed = purchaseOrderSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.tenant_id) {
    throw new Error(profileError?.message ?? "Unable to resolve tenant");
  }

  const { error } = await supabase.from("purchase_orders").insert({
    ...parsed.data,
    tenant_id: profile.tenant_id,
    requested_by: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/purchase-orders");
  redirect("/purchase-orders");
}
