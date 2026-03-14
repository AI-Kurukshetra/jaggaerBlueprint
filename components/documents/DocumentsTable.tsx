"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import type { SupplierDocument } from "@/types/supabase";

const EXPIRY_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

function isExpiringSoon(timestamp?: string | null) {
  if (!timestamp) {
    return false;
  }
  return new Date(timestamp).getTime() <= Date.now() + EXPIRY_WINDOW_MS;
}

type DocumentsTableProps = {
  documents: SupplierDocument[];
  supplierLookup: Record<string, string>;
};

export default function DocumentsTable({ documents, supplierLookup }: DocumentsTableProps) {
  const [query, setQuery] = useState("");
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const supplierName = supplierLookup[document.supplier_id] ?? "";
      const matchesQuery =
        !normalizedQuery ||
        supplierName.toLowerCase().includes(normalizedQuery) ||
        document.file_name.toLowerCase().includes(normalizedQuery) ||
        document.document_type.toLowerCase().includes(normalizedQuery);
      const matchesExpiry = !showExpiringOnly || isExpiringSoon(document.expires_at);
      return matchesQuery && matchesExpiry;
    });
  }, [documents, normalizedQuery, showExpiringOnly, supplierLookup]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search documents or suppliers..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-sm"
        />
        <Button
          variant={showExpiringOnly ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowExpiringOnly((current) => !current)}
        >
          {showExpiringOnly ? "Showing expiring" : "Show expiring only"}
        </Button>
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-100">
        {filteredDocuments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No documents"
              description="Try updating your search or toggling the expiry filter."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => {
                const supplierName = supplierLookup[document.supplier_id] ?? "Unknown";
                const expires = document.expires_at
                  ? new Date(document.expires_at).toLocaleDateString("en-US")
                  : "N/A";
                const expiringSoon = isExpiringSoon(document.expires_at);
                return (
                  <TableRow key={document.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {supplierName}
                    </TableCell>
                    <TableCell>{document.file_name}</TableCell>
                    <TableCell>{document.document_type}</TableCell>
                    <TableCell>
                      <Badge variant={document.expires_at ? (expiringSoon ? "warning" : "info") : "neutral"}>
                        {expires}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
