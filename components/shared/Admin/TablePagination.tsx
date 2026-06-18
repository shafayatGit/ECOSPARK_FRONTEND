import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/types/api.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const TablePagination = ({
  meta,
  onPageChange,
  isLoading = false,
}: TablePaginationProps) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1 || isLoading}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages || isLoading}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
