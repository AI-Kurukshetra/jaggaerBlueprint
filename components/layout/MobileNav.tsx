"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/certifications", label: "Certs" },
  { href: "/scorecards", label: "Scorecards" },
  { href: "/compliance", label: "Compliance" },
  { href: "/documents", label: "Documents" },
  { href: "/analytics", label: "Analytics" },
  { href: "/purchase-orders", label: "POs" },
  { href: "/contracts", label: "Contracts" },
  { href: "/invoices", label: "Invoices" },
  { href: "/rfqs", label: "RFQs" },
  { href: "/risk", label: "Risk" },
  { href: "/insights", label: "Insights" },
  { href: "/portal", label: "Portal" },
  { href: "/settings", label: "Settings" }
] satisfies { href: Route; label: string }[];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-card lg:hidden dark:border-slate-800 dark:bg-slate-900">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition",
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
