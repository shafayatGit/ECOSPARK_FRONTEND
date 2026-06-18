"use client";

import RejectIdeaDialog from "@/components/modules/Dashboard/Admin/IdeaManagement/RejectIdeaDialog";
import SearchInput from "@/components/shared/Admin/SearchInput";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import TablePagination from "@/components/shared/Admin/TablePagination";
import DateCell from "@/components/shared/Cell/DataCell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatStatusLabel, truncateText } from "@/lib/formatters";
import {
  approveIdea,
  getAdminIdeas,
  startIdeaReview,
} from "@/service/adminIdeas.service";
import { IdeaStatus } from "@/types/dashboard.types";
import { AdminIdea } from "@/types/idea.types";
import { IAdminIdeaListQuery } from "@/zod/listQuery.validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, Eye, Lightbulb, MoreHorizontal, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DRAFT", label: "Draft" },
];

const PAID_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "true", label: "Paid" },
  { value: "false", label: "Free" },
];

const IDEA_STATUSES: IdeaStatus[] = [
  "DRAFT",
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

const getAdminStatusTargets = (currentStatus: IdeaStatus): IdeaStatus[] => {
  switch (currentStatus) {
    case "PENDING":
      return ["UNDER_REVIEW", "APPROVED", "REJECTED"];
    case "UNDER_REVIEW":
      return ["APPROVED", "REJECTED"];
    default:
      return [];
  }
};

const IdeaManagementContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [isPaid, setIsPaid] = useState("all");
  const [page, setPage] = useState(1);
  const [rejectIdea, setRejectIdea] = useState<AdminIdea | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, isPaid]);

  const queryParams: IAdminIdeaListQuery = {
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "asc",
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    ...(status !== "ALL" ? { status } : { status: "ALL" }),
    ...(isPaid !== "all" ? { isPaid: isPaid as "true" | "false" } : {}),
  };

  const { data: response, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-ideas", queryParams],
    queryFn: () => getAdminIdeas(queryParams),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
  }, [queryClient]);

  const reviewMutation = useMutation({
    mutationFn: startIdeaReview,
    onMutate: (ideaId: string) => setActionId(ideaId),
    onSettled: () => setActionId(null),
  });

  const approveMutation = useMutation({
    mutationFn: approveIdea,
    onMutate: (ideaId: string) => setActionId(ideaId),
    onSettled: () => setActionId(null),
  });

  const handleReview = async (ideaId: string) => {
    setActionError(null);
    const result = await reviewMutation.mutateAsync(ideaId);
    if (!result.success) {
      setActionError(result.message);
      return;
    }
    invalidate();
  };

  const handleApprove = async (ideaId: string) => {
    setActionError(null);
    const result = await approveMutation.mutateAsync(ideaId);
    if (!result.success) {
      setActionError(result.message);
      return;
    }
    invalidate();
  };

  const ideas = response?.success ? (response.data ?? []) : [];
  const meta = response?.meta;

  const handleStatusChange = async (
    idea: AdminIdea,
    targetStatus: IdeaStatus,
  ) => {
    if (targetStatus === idea.status) return;

    setActionError(null);

    try {
      if (targetStatus === "UNDER_REVIEW") {
        await handleReview(idea.id);
        return;
      }

      if (targetStatus === "APPROVED") {
        if (idea.status === "PENDING") {
          const res = await reviewMutation.mutateAsync(idea.id);
          if (!res.success) {
            setActionError(res.message);
            return;
          }
        }
        await handleApprove(idea.id);
        return;
      }

      if (targetStatus === "REJECTED") {
        if (idea.status === "PENDING") {
          const res = await reviewMutation.mutateAsync(idea.id);
          if (!res.success) {
            setActionError(res.message);
            return;
          }
          invalidate();
          setRejectIdea({ ...idea, status: "UNDER_REVIEW" });
        } else {
          setRejectIdea(idea);
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update status.";
      setActionError(message);
    }
  };

  const renderActions = (idea: AdminIdea) => {
    const isActing = actionId === idea.id;
    const currentStatus = idea.status;
    const availableTargets = getAdminStatusTargets(currentStatus);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isActing}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {}}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {IDEA_STATUSES.map((statusOption) => {
            const isCurrent = statusOption === currentStatus;
            const isAvailable = availableTargets.includes(statusOption);

            return (
              <DropdownMenuItem
                key={statusOption}
                disabled={isCurrent || !isAvailable}
                onClick={() => handleStatusChange(idea, statusOption)}
                className={
                  statusOption === "APPROVED"
                    ? "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 dark:focus:bg-emerald-950/20"
                    : statusOption === "REJECTED"
                      ? "text-destructive focus:bg-destructive/5 focus:text-destructive"
                      : undefined
                }
              >
                {isCurrent ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <span className="mr-2 inline-block h-4 w-4" />
                )}
                {formatStatusLabel(statusOption)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Idea Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, approve, or reject submitted sustainability ideas.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-fit"
        >
          <RefreshCw className={isFetching ? "animate-spin" : ""} data-icon="inline-start" />
          Refresh
        </Button>
      </div>

      {actionError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="gap-4">
          <CardTitle>Review Queue</CardTitle>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search ideas..."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={isPaid} onValueChange={setIsPaid}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {PAID_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !response?.success ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>
                {response?.message || "Failed to load ideas."}
              </AlertDescription>
            </Alert>
          ) : ideas.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Lightbulb />
                </EmptyMedia>
                <EmptyTitle>No ideas found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your filters or search term.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Idea</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ideas.map((idea) => (
                      <TableRow key={idea.id}>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate font-medium">
                            {truncateText(idea.title, 40)}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {idea.isPaid ? (
                              <Badge variant="secondary" className="text-[10px]">
                                {idea.price
                                  ? formatCurrency(idea.price)
                                  : "Paid"}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">
                                Free
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground md:hidden">
                              {idea.author.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[160px] md:table-cell">
                          <div className="truncate">{idea.author.name}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {idea.author.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{idea.category.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={idea.status} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <DateCell date={idea.createdAt} />
                        </TableCell>
                        <TableCell className="text-right">
                          {renderActions(idea)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <TablePagination
                meta={meta}
                onPageChange={setPage}
                isLoading={isFetching}
              />
            </>
          )}
        </CardContent>
      </Card>

      <RejectIdeaDialog
        idea={rejectIdea}
        open={!!rejectIdea}
        onOpenChange={(open) => !open && setRejectIdea(null)}
        onSuccess={invalidate}
      />
    </div>
  );
};

export default IdeaManagementContent;
