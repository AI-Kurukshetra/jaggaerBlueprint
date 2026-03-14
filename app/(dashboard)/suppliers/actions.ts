"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  supplierSchema,
  supplierCertificationSchema,
  supplierScorecardSchema,
  supplierDocumentSchema
} from "@/lib/validations/supplier";

export async function createSupplier(formData: FormData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    location: String(formData.get("location") ?? ""),
    risk_score: Number(formData.get("risk_score") ?? 0)
  };

  const parsed = supplierSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").insert(parsed.data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/suppliers");
  revalidatePath("/dashboard");
  redirect("/suppliers");
}

export async function updateSupplier(id: string, formData: FormData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    location: String(formData.get("location") ?? ""),
    risk_score: Number(formData.get("risk_score") ?? 0)
  };

  const parsed = supplierSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("suppliers")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/suppliers/${id}`);
  revalidatePath("/suppliers");
  revalidatePath("/dashboard");
}

export async function deleteSupplier(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/suppliers");
  revalidatePath("/dashboard");
  redirect("/suppliers");
}

export async function addSupplierScorecard(id: string, formData: FormData) {
  const values = {
    delivery_score: Number(formData.get("delivery_score") ?? 0),
    quality_score: Number(formData.get("quality_score") ?? 0),
    service_score: Number(formData.get("service_score") ?? 0)
  };

  const parsed = supplierScorecardSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const overall_score = Math.round(
    (parsed.data.delivery_score + parsed.data.quality_score + parsed.data.service_score) / 3
  );

  const supabase = await createClient();
  const { error } = await supabase.from("supplier_scorecards").insert({
    supplier_id: id,
    ...parsed.data,
    overall_score
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/suppliers/${id}`);
  revalidatePath("/dashboard");
}

export async function addSupplierCertification(id: string, formData: FormData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    issuer: String(formData.get("issuer") ?? ""),
    expires_at: String(formData.get("expires_at") ?? "")
  };

  const parsed = supplierCertificationSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("certifications").insert({
    supplier_id: id,
    ...parsed.data
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/suppliers/${id}`);
  revalidatePath("/dashboard");
}

export async function addSupplierDocument(id: string, payload: {
  document_type: string;
  file_path: string;
  file_name: string;
  expires_at?: string;
}) {
  const parsed = supplierDocumentSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("documents").insert({
    supplier_id: id,
    ...parsed.data
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/suppliers/${id}`);
}
