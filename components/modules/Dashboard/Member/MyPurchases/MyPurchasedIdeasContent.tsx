"use client";

import SearchInput from "@/components/shared/Admin/SearchInput";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import TablePagination from "@/components/shared/Admin/TablePagination";
import DateCell from "@/components/shared/Cell/DataCell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { getMyPurchases } from "@/service/memberPurchases.service";
import { IMemberPurchaseListQuery } from "@/zod/listQuery.validation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const MyPurchasedIdeasContent = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, paymentStatus]);

  const queryParams: IMemberPurchaseListQuery = {
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    ...(paymentStatus !== "all"
      ? { paymentStatus: paymentStatus as "PENDING" | "COMPLETED" | "FAILED" }
      : {}),
  };

  const { data: response, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["my-purchases", queryParams],
    queryFn: () => getMyPurchases(queryParams),
  });

  const purchases = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            My Purchased Ideas
          </h1>
          <p className="text-sm text-muted-foreground">
            View ideas you have purchased and their payment status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-fit"
        >
          <RefreshCw
            className={isFetching ? "animate-spin" : ""}
            data-icon="inline-start"
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full max-w-sm">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search purchases..."
              />
            </div>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
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
                {response?.message || "Failed to load purchases."}
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : purchases.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No purchases found</EmptyTitle>
                <EmptyDescription>
                  {debouncedSearch || paymentStatus !== "all"
                    ? "No purchases match your current filters."
                    : "You have not purchased any ideas yet."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="relative">
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Idea</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          {truncateText(purchase.idea.title, 35)}
                        </TableCell>
                        <TableCell>
                          {purchase.idea.category?.name || "—"}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(purchase.amountPaid)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={purchase.paymentStatus} />
                        </TableCell>
                        <TableCell>{purchase.gateway}</TableCell>
                        <TableCell>
                          <DateCell
                            date={purchase.completedAt || purchase.createdAt}
                          />
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

export default MyPurchasedIdeasContent;
