"use client";

import Link from "next/link";
import type { Supplier } from "@/types/supabase";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";

type RiskMeta = {
  label: string;
  variant: "success" | "warning" | "danger" | "info";
};

function getRiskMeta(score: number): RiskMeta {
  if (score >= 85) {
    return { label: "Critical", variant: "danger" };
  }
  if (score >= 70) {
    return { label: "High", variant: "warning" };
  }
  if (score >= 40) {
    return { label: "Moderate", variant: "info" };
  }
  return { label: "Low", variant: "success" };
}

type SupplierTableProps = {
  suppliers: Supplier[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function SupplierTable({
  suppliers,
  emptyTitle,
  emptyDescription
}: SupplierTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-100 p-6">
        <EmptyState
          title={emptyTitle ?? "No suppliers available"}
          description={
            emptyDescription ?? "Adjust the search or add a new supplier to see data."
          }
        />
      </div>
    );
  }

  return (
    <div className="max-h-[520px] overflow-y-auto rounded-2xl border border-slate-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => {
            const risk = getRiskMeta(supplier.risk_score);
            const statusLabel = supplier.status ?? "Active";
            const statusVariant: Parameters<typeof Badge>[0]["variant"] =
              statusLabel === "Active"
                ? "success"
                : statusLabel === "Inactive"
                  ? "neutral"
                  : statusLabel === "Pending"
                    ? "warning"
                    : "info";
            return (
              <TableRow key={supplier.id} className="text-slate-700">
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-xs font-semibold text-brand-700">
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {supplier.name}
                      </div>
                      <div className="text-xs text-slate-500">{supplier.location}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700">{supplier.email}</div>
                  <div className="text-xs text-slate-400">
                    {supplier.contact_email ?? supplier.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={risk.variant}>{risk.label}</Badge>
                    <span className="text-xs text-slate-400">
                      {supplier.risk_score} score
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/suppliers/${supplier.id}`}
                    className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
