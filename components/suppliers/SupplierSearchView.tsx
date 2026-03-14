"use client";

import { useEffect, useMemo, useState } from "react";
import type { Supplier } from "@/types/supabase";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import SupplierTable from "@/components/suppliers/SupplierTable";

type SupplierSearchViewProps = {
  initialSuppliers: Supplier[];
};

export default function SupplierSearchView({ initialSuppliers }: SupplierSearchViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displaySuppliers, setDisplaySuppliers] = useState(initialSuppliers);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedTerm = useMemo(() => searchTerm.trim(), [searchTerm]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function runSearch() {
      if (!debouncedTerm) {
        setDisplaySuppliers(initialSuppliers);
        setIsSearching(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        params.set("search", debouncedTerm);
        const response = await fetch(`/api/suppliers?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to search suppliers");
        }

        const data: Supplier[] = await response.json();
        if (active) {
          setDisplaySuppliers(data);
          setError(null);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        if (active) {
          setError((err as Error).message ?? "Search failed");
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }

    const handle = setTimeout(runSearch, 420);
    return () => {
      active = false;
      controller.abort();
      clearTimeout(handle);
    };
  }, [debouncedTerm, initialSuppliers]);

  const emptyTitle = debouncedTerm
    ? "No suppliers match that query"
    : "No suppliers found";
  const emptyDescription = debouncedTerm
    ? `Try a different keyword or add a new supplier.`
    : "Create your first supplier to begin onboarding.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search by supplier, category, country, or contact email"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-lg"
        />
        {isSearching ? (
          <p className="text-xs text-slate-500">Searching...</p>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-rose-600">Search failed: {error}</p>
      ) : null}
      <SupplierTable
        suppliers={displaySuppliers}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </div>
  );
}
