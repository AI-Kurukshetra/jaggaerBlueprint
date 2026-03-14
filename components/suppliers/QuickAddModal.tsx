"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function QuickAddModal({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      await action(formData);
      addToast({
        title: "Supplier added",
        description: "The supplier profile has been created.",
        variant: "success"
      });
      setIsOpen(false);
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
        title: "Unable to add supplier",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        Quick Add
      </Button>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Quick Add Supplier"
        description="Capture essentials without leaving the list view."
      >
        <form action={handleSubmit} className="grid gap-4">
          <Input name="name" required placeholder="Supplier name" />
          <Input name="category" required placeholder="Category" />
          <Input name="email" type="email" required placeholder="Email" />
          <Input name="phone" required placeholder="Phone" />
          <Input name="location" required placeholder="Location" />
          <Input name="risk_score" type="number" min={0} max={100} defaultValue={50} />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Supplier
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
