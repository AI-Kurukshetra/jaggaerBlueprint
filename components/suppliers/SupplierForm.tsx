"use client";

import { useState } from "react";
import type { Supplier } from "@/types/supabase";
import { supplierSchema } from "@/lib/validations/supplier";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SupplierForm({
  supplier,
  action,
  submitLabel
}: {
  supplier?: Supplier | null;
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
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      location: String(formData.get("location") ?? ""),
      risk_score: Number(formData.get("risk_score") ?? 0)
    };

    const parsed = supplierSchema.safeParse(values);
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
        title: supplier ? "Supplier updated" : "Supplier created",
        description: supplier ? "Changes saved successfully." : "Supplier profile is ready.",
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
        title: "Unable to save supplier",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={supplier?.name ?? ""}
          placeholder="Acme Industrial Co."
          className="mt-1"
        />
        {fieldErrors.name ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.name}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Supplier legal entity name.</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="category">
          Category
        </label>
        <Input
          id="category"
          name="category"
          required
          defaultValue={supplier?.category ?? ""}
          placeholder="Logistics"
          className="mt-1"
        />
        {fieldErrors.category ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.category}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Primary service category.</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={supplier?.email ?? ""}
          placeholder="ops@acme.com"
          className="mt-1"
        />
        {fieldErrors.email ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Used for onboarding updates.</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="phone">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          required
          defaultValue={supplier?.phone ?? ""}
          placeholder="+1 (555) 012-3456"
          className="mt-1"
        />
        {fieldErrors.phone ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.phone}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="location">
          Location
        </label>
        <Input
          id="location"
          name="location"
          required
          defaultValue={supplier?.location ?? ""}
          placeholder="Austin, TX"
          className="mt-1"
        />
        {fieldErrors.location ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.location}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="risk_score">
          Risk Score
        </label>
        <Input
          id="risk_score"
          name="risk_score"
          type="number"
          min={0}
          max={100}
          required
          defaultValue={supplier?.risk_score ?? 50}
          className="mt-1"
        />
        {fieldErrors.risk_score ? (
          <p className="mt-1 text-xs text-rose-600">{fieldErrors.risk_score}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">
            Score from 0-100. Higher indicates more risk.
          </p>
        )}
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
