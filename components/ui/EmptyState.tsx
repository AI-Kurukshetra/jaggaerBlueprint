import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/60",
        className
      )}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-soft dark:bg-slate-900 dark:text-slate-200">
          {icon}
        </div>
      ) : null}
      <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      {description ? (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
