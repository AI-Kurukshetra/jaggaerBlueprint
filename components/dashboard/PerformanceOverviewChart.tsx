import { cn } from "@/lib/utils";

export default function PerformanceOverviewChart({
  data,
  labels
}: {
  data: number[];
  labels: string[];
}) {
  const max = Math.max(...data, 100);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="relative h-40 w-full rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f60db" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinejoin="round"
            points={points}
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 100;
            return (
              <circle key={value + index} cx={x} cy={y} r={2.5} fill="#0f60db" />
            );
          })}
        </svg>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        {labels.map((label) => (
          <span
            key={label}
            className={cn("uppercase tracking-[0.2em]")}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
