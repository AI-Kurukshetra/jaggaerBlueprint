import { cn } from "@/lib/utils";

export type RiskBucket = {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose" | "sky";
};

const toneStyles: Record<RiskBucket["tone"], string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500"
};

export default function RiskDistributionChart({
  buckets,
  total
}: {
  buckets: RiskBucket[];
  total: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {buckets.map((bucket) => (
          <div
            key={bucket.label}
            className={cn(toneStyles[bucket.tone], "transition-all")}
            style={{ width: `${total === 0 ? 0 : (bucket.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {buckets.map((bucket) => (
          <div
            key={bucket.label}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", toneStyles[bucket.tone])} />
              <span className="text-xs font-semibold text-slate-700">
                {bucket.label}
              </span>
            </div>
            <span className="text-xs text-slate-500">{bucket.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
