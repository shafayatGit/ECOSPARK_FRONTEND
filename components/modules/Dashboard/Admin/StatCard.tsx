import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: {
    label: string;
    value: string;
  };
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  trend,
}: StatCardProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-[min(var(--radius-4xl),24px)] bg-card p-5 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary",
            iconClassName,
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      {(description || trend) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {description && <span>{description}</span>}
          {trend && (
            <span className="font-medium text-foreground">{trend.value}</span>
          )}
          {trend && <span>{trend.label}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
