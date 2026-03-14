"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function LogoutButton({ action }: { action: () => Promise<void> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    const confirmed = window.confirm("Log out of SupplySync AI?");
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleLogout} isLoading={isSubmitting}>
      Log out
    </Button>
  );
}
