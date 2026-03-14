import { cn } from "@/lib/utils";

const badgeStyles = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof badgeStyles;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        badgeStyles[variant],
        className
      )}
      {...props}
    />
  );
}
