
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'active' | 'acknowledged' | 'resolved' | 'info';
  className?: string;
  text?: string;
}

export function StatusBadge({ status, className, text }: StatusBadgeProps) {
  let statusConfig = {
    backgroundColor: "",
    textColor: "",
    label: text || status,
  };

  switch (status) {
    case 'healthy':
    case 'resolved':
      statusConfig = {
        ...statusConfig,
        backgroundColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-800 dark:text-green-300",
      };
      break;
    case 'warning':
    case 'acknowledged':
      statusConfig = {
        ...statusConfig,
        backgroundColor: "bg-yellow-100 dark:bg-yellow-900/30",
        textColor: "text-yellow-800 dark:text-yellow-300",
      };
      break;
    case 'critical':
    case 'active':
      statusConfig = {
        ...statusConfig,
        backgroundColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-800 dark:text-red-300",
      };
      break;
    case 'info':
      statusConfig = {
        ...statusConfig,
        backgroundColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-800 dark:text-blue-300",
      };
      break;
    default:
      statusConfig = {
        ...statusConfig,
        backgroundColor: "bg-gray-100 dark:bg-gray-800",
        textColor: "text-gray-800 dark:text-gray-300",
      };
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusConfig.backgroundColor,
        statusConfig.textColor,
        className
      )}
    >
      {statusConfig.label.charAt(0).toUpperCase() + statusConfig.label.slice(1)}
    </span>
  );
}
