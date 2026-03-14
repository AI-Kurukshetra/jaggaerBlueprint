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
import type { SupplierComplianceRecord } from "@/types/supabase";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = {
  approved: "success",
  pending: "warning",
  flagged: "danger"
};

type ComplianceTableProps = {
  records: SupplierComplianceRecord[];
  supplierLookup: Record<string, string>;
};

export default function ComplianceTable({ records, supplierLookup }: ComplianceTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const normalizedQuery = query.trim().toLowerCase();
  const statuses = useMemo(() => {
    const unique = Array.from(new Set(records.map((record) => record.status ?? "pending")));
    return ["all", ...unique.sort()];
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const recordStatus = record.status ?? "pending";
      if (statusFilter !== "all" && recordStatus !== statusFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const supplierName = supplierLookup[record.supplier_id] ?? "";
      return (
        supplierName.toLowerCase().includes(normalizedQuery) ||
        record.policy_name.toLowerCase().includes(normalizedQuery) ||
        (record.notes ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [records, normalizedQuery, statusFilter, supplierLookup]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search policy, supplier, notes..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="max-w-sm"
          />
          <span className="text-xs text-slate-500">
            {filtered.length} of {records.length} records
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-100">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No matching records"
              description="Adjust the filters or search terms to find compliance reviews."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Reviewed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => {
                const supplierName = supplierLookup[record.supplier_id] ?? "Unknown";
                const recordStatus = record.status ?? "pending";
                const badgeTone = STATUS_TONE[recordStatus] ?? "info";
                const reviewedAt = record.reviewed_at ?? record.created_at;
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {supplierName}
                    </TableCell>
                    <TableCell>{record.policy_name}</TableCell>
                    <TableCell>
                      <Badge variant={badgeTone}>{record.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {reviewedAt ? new Date(reviewedAt).toLocaleDateString("en-US") : "Pending"}
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
