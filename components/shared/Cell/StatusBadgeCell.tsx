import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user.types";

interface IStatusBadgeCellProps {
  status: UserStatus;
}

const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
  return (
    <Badge
      variant={
        status === "ACTIVE"
          ? "default"
          : status === "INACTIVE"
            ? "destructive"
            : "secondary"
      }
      // className="px-2 py-1"
    >
      <span className="text-sm capitalize">{status.toLowerCase()}</span>
    </Badge>
  );
};

export default StatusBadgeCell;
