import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function StatCard({
  title,
  value,
  helper,
  icon,
  tone = "default"
}: {
  title: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-sky-500 to-emerald-400 opacity-80" />
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            tone === "accent"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-slate-600"
          )}
        >
          {icon}
        </div>
      </div>
      <div className="mt-5 flex items-end gap-3">
        <div className="text-3xl font-semibold text-slate-900">{value}</div>
        <div className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
          Live
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </Card>
  );
}
