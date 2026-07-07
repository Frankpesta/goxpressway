import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  "Shipment Registered": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "In Transit": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "Held at the Airport": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
