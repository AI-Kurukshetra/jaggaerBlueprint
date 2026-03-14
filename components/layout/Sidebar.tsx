"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BadgeCheck,
  ClipboardList,
  Shield,
  FolderOpen,
  BarChart3,
  ShoppingCart,
  FileSignature,
  Receipt,
  FileText,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Settings
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const coreItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  { href: "/onboarding", label: "Onboarding", icon: UserPlus },
  { href: "/certifications", label: "Certifications", icon: BadgeCheck },
  { href: "/scorecards", label: "Scorecards", icon: ClipboardList },
  { href: "/compliance", label: "Compliance", icon: Shield },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 }
] satisfies { href: Route; label: string; icon: LucideIcon }[];

const procurementItems = [
  { href: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
  { href: "/contracts", label: "Contracts", icon: FileSignature },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/rfqs", label: "RFQs", icon: FileText }
] satisfies { href: Route; label: string; icon: LucideIcon }[];

const insightsItems = [
  { href: "/risk", label: "Supplier Risk", icon: ShieldAlert },
  { href: "/insights", label: "AI Insights", icon: Sparkles }
] satisfies { href: Route; label: string; icon: LucideIcon }[];

const otherItems = [
  { href: "/portal", label: "Supplier Portal", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings }
] satisfies { href: Route; label: string; icon: LucideIcon }[];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0">
      <div className="flex h-full flex-col rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-soft">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">SupplySync AI</p>
          <h2 className="mt-2 text-lg font-semibold">Supplier Command</h2>
          <p className="mt-1 text-xs text-slate-400">SaaS operations workspace</p>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Core</p>
          {coreItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Procurement</p>
          <nav className="mt-3 flex flex-col gap-2">
            {procurementItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Insights & Risk</p>
          <nav className="mt-3 flex flex-col gap-2">
            {insightsItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">More</p>
          <nav className="mt-3 flex flex-col gap-2">
            {otherItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-slate-200">
          <p className="font-semibold">Supplier Pulse</p>
          <p className="mt-1 text-slate-400">
            Monitor expiring certifications and risk alerts in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}
