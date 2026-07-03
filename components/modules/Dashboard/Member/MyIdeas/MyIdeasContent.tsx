"use client";

import SearchInput from "@/components/shared/Admin/SearchInput";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import TablePagination from "@/components/shared/Admin/TablePagination";
import DateCell from "@/components/shared/Cell/DataCell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import { formatCurrency, truncateText } from "@/lib/formatters";
import {
  deleteIdea,
  getMyIdeas,
  submitIdea,
} from "@/service/memberIdeas.service";
import { MemberIdea } from "@/types/idea.types";
import { IMemberIdeaListQuery } from "@/zod/listQuery.validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Lightbulb,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const EDITABLE_STATUSES = ["DRAFT", "REJECTED"];
const SUBMITTABLE_STATUSES = ["DRAFT", "REJECTED"];

const MyIdeasContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const queryParams: IMemberIdeaListQuery = {
    page,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    ...(status !== "ALL" ? { status } : {}),
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["my-ideas", queryParams],
    queryFn: () => getMyIdeas(queryParams),
  });

  const submitMutation = useMutation({
    mutationFn: submitIdea,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Idea submitted for review");
        queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      } else {
        toast.error(res.message || "Failed to submit idea");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
    onSettled: () => setActionId(null),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Idea deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      } else {
        toast.error(res.message || "Failed to delete idea");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
    onSettled: () => setActionId(null),
  });

  const handleSubmit = (idea: MemberIdea) => {
    setActionId(idea.id);
    submitMutation.mutate(idea.id);
  };

  const handleDelete = (idea: MemberIdea) => {
    if (!window.confirm(`Delete "${idea.title}"? This cannot be undone.`)) {
      return;
    }
    setActionId(idea.id);
    deleteMutation.mutate(idea.id);
  };

  const ideas = response?.data ?? [];
  const meta = response?.meta;

  const renderActions = (idea: MemberIdea) => {
    const isActing = actionId === idea.id;
    const canEdit = EDITABLE_STATUSES.includes(idea.status);
    const canSubmit = SUBMITTABLE_STATUSES.includes(idea.status);
    const canDelete = idea.status !== "APPROVED";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isActing}>
            {isActing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canEdit && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/create-idea?id=${idea.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Idea
              </Link>
            </DropdownMenuItem>
          )}
          {canSubmit && (
            <DropdownMenuItem onClick={() => handleSubmit(idea)}>
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              onClick={() => handleDelete(idea)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            My Ideas
          </h1>
          <p className="text-sm text-muted-foreground">
            View, edit, and submit your sustainability ideas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={isFetching ? "animate-spin" : ""}
              data-icon="inline-start"
            />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/create-idea">
              <Plus data-icon="inline-start" />
              Create Idea
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full max-w-sm">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search your ideas..."
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px]">
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
          </div>
        </CardHeader>
        <CardContent>
          {!response?.success && !isLoading ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {response?.message || "Failed to load ideas."}
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : ideas.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Lightbulb className="h-10 w-10 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No ideas found</EmptyTitle>
                <EmptyDescription>
                  {debouncedSearch || status !== "ALL"
                    ? "No ideas match your current filters."
                    : "You have not created any ideas yet."}
                </EmptyDescription>
              </EmptyHeader>
              <Button asChild>
                <Link href="/dashboard/create-idea">
                  Create your first idea
                </Link>
              </Button>
            </Empty>
          ) : (
            <div className="relative">
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ideas.map((idea) => (
                      <TableRow key={idea.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {truncateText(idea.title, 35)}
                            </p>
                            {idea.rejectionFeedback && (
                              <p className="mt-1 text-xs text-destructive">
                                {truncateText(idea.rejectionFeedback, 60)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{idea.category.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={idea.status} />
                        </TableCell>
                        <TableCell>
                          {idea.isPaid
                            ? formatCurrency(idea.price ?? 0)
                            : "Free"}
                        </TableCell>
                        <TableCell>
                          <DateCell date={idea.updatedAt} />
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

              {meta && meta.totalPages > 1 && (
                <div className="mt-4">
                  <TablePagination
                    meta={meta}
                    onPageChange={setPage}
                    isLoading={isFetching}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyIdeasContent;
