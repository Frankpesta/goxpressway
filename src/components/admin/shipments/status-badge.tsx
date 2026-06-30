import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  "Created": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "Picked Up": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "In Transit": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "Arrived At Facility": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Out For Delivery": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Failed Delivery": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Returned": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Cancelled": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
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
