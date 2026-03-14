"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function DeleteSupplierButton({ action }: { action: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this supplier? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await action();
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
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "error"
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button type="button" variant="outline" isLoading={isDeleting} onClick={handleDelete}>
      Delete Supplier
    </Button>
  );
}
