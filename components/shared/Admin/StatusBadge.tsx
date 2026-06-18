import { Badge } from "@/components/ui/badge";
import { formatStatusLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

const STATUS_VARIANTS: Record<string, StatusVariant> = {
  PENDING: "secondary",
  DRAFT: "secondary",
  UNDER_REVIEW: "outline",
  APPROVED: "default",
  COMPLETED: "default",
  ACTIVE: "default",
  REJECTED: "destructive",
  FAILED: "destructive",
  INACTIVE: "destructive",
  MEMBER: "secondary",
  ADMIN: "default",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variant = STATUS_VARIANTS[status] ?? "outline";

  return (
    <Badge variant={variant} className={cn(className)}>
      {formatStatusLabel(status)}
    </Badge>
  );
};

export default StatusBadge;
