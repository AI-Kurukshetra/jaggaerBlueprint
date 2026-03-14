"use client";

import { useState } from "react";
import type { Supplier } from "@/types/supabase";
import { purchaseOrderSchema } from "@/lib/validations/purchase-order";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const statusOptions = ["draft", "pending", "approved", "issued", "closed", "cancelled"] as const;

export default function PurchaseOrderForm({
  suppliers,
  action,
  submitLabel
}: {
  suppliers: Supplier[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const values = {
      supplier_id: String(formData.get("supplier_id") ?? ""),
      po_number: String(formData.get("po_number") ?? ""),
      status: String(formData.get("status") ?? "draft"),
      total_amount: Number(formData.get("total_amount") ?? 0),
      currency: String(formData.get("currency") ?? "USD").toUpperCase()
    };

    const parsed = purchaseOrderSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.errors.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setFieldErrors(nextErrors);
      setIsSaving(false);
      return;
    }

    try {
      await action(formData);
      addToast({
        title: "Purchase order created",
        description: "The PO has been sent for approval.",
        variant: "success"
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof (error as { digest?: string }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
      addToast({
        title: "Unable to create PO",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Supplier</label>
        <select
          name="supplier_id"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/40"
        >
          <option value="">Select supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {fieldErrors.supplier_id ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.supplier_id}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">PO Number</label>
        <Input
          name="po_number"
          required
          placeholder="PO-10023"
          className="mt-1"
        />
        {fieldErrors.po_number ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.po_number}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
        <select
          name="status"
          required
          defaultValue="draft"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-900/40"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {fieldErrors.status ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.status}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Currency</label>
        <Input
          name="currency"
          required
          defaultValue="USD"
          className="mt-1"
        />
        {fieldErrors.currency ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.currency}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Total Amount</label>
        <Input
          name="total_amount"
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={0}
          className="mt-1"
        />
        {fieldErrors.total_amount ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.total_amount}</p>
        ) : null}
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" isLoading={isSaving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
