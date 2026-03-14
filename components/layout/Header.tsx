import { Bell, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import LogoutButton from "@/components/layout/LogoutButton";
import { signOut } from "@/app/(dashboard)/actions";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white/90 px-6 py-4 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Welcome back</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          SupplySync AI
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="hidden w-full max-w-xs items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 md:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search suppliers, scorecards..."
            className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0"
          />
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 sm:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <span className="h-7 w-7 rounded-full bg-brand-600 text-center text-[11px] font-semibold leading-7 text-white">
            {user?.email?.slice(0, 2).toUpperCase() ?? "SU"}
          </span>
          {user?.email ?? ""}
        </div>
        <LogoutButton action={signOut} />
      </div>
    </header>
  );
}
