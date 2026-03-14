import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "error";

const variantStyles: Record<AlertVariant, string> = {
  info: "border-sky-100 bg-sky-50 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200",
  success: "border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
  error: "border-rose-100 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
};

const icons: Record<AlertVariant, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />
};

export function Alert({
  title,
  description,
  variant = "info",
  className
}: {
  title: string;
  description?: string;
  variant?: AlertVariant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="mt-0.5">{icons[variant]}</div>
      <div>
        <p className="font-semibold">{title}</p>
        {description ? <p className="text-xs opacity-80">{description}</p> : null}
      </div>
    </div>
  );
}
