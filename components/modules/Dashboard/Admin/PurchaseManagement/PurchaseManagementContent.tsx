"use client";

import SearchInput from "@/components/shared/Admin/SearchInput";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import TablePagination from "@/components/shared/Admin/TablePagination";
import StatCard from "@/components/modules/Dashboard/Admin/StatCard";
import DateCell from "@/components/shared/Cell/DataCell";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { getPurchaseOverview, getPurchases } from "@/service/purchase.service";
import { IPurchaseListQuery } from "@/zod/listQuery.validation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock,
  CreditCard,
  DollarSign,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const PurchaseManagementContent = () => {
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

  const queryParams: IPurchaseListQuery = {
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    ...(paymentStatus !== "all"
      ? { paymentStatus: paymentStatus as "PENDING" | "COMPLETED" | "FAILED" }
      : {}),
  };

  const { data: overviewResponse, isLoading: overviewLoading } = useQuery({
    queryKey: ["purchase-overview"],
    queryFn: getPurchaseOverview,
  });

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-purchases", queryParams],
    queryFn: () => getPurchases(queryParams),
  });

  const overview = overviewResponse?.success ? overviewResponse.data : null;
  const purchases = response?.success ? (response.data ?? []) : [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Purchase Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor transactions, revenue, and payment statuses across the
            platform.
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

      {overviewLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Purchases"
            value={overview.total}
            icon={ShoppingBag}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(overview.totalRevenue)}
            icon={DollarSign}
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            title="Completed"
            value={overview.completed}
            icon={CreditCard}
            iconClassName="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          />
          <StatCard
            title="Pending / Failed"
            value={`${overview.pending} / ${overview.failed}`}
            description="Awaiting or unsuccessful payments"
            icon={overview.failed > 0 ? XCircle : Clock}
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
        </div>
      ) : null}

      <Card>
        <CardHeader className="gap-4">
          <CardTitle>All Purchases</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by transaction ID..."
            />
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
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
                {response?.message || "Failed to load purchases."}
              </AlertDescription>
            </Alert>
          ) : purchases.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingBag />
                </EmptyMedia>
                <EmptyTitle>No purchases found</EmptyTitle>
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
                      <TableHead className="hidden md:table-cell">
                        Buyer
                      </TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Gateway
                      </TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase?.id}>
                        <TableCell className="max-w-[180px]">
                          <div className="truncate font-medium">
                            {truncateText(purchase?.idea.title ?? "", 35)}
                          </div>
                          <div className="mt-1 truncate text-xs text-muted-foreground md:hidden">
                            {purchase?.user?.name || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-[160px] md:table-cell">
                          <div className="truncate">
                            {purchase?.user?.name || "—"}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {purchase?.user?.email || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(purchase?.amountPaid ?? 0)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              purchase?.paymentStatus
                                ? purchase?.paymentStatus
                                : ""
                            }
                          />
                        </TableCell>
                        <TableCell className="hidden capitalize lg:table-cell">
                          {purchase?.gateway}
                        </TableCell>
                        <TableCell className="text-right">
                          <DateCell
                            date={
                              purchase?.completedAt ||
                              purchase?.createdAt ||
                              new Date()
                            }
                            formatString="MMM dd, yyyy HH:mm"
                          />
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
    </div>
  );
};

export default PurchaseManagementContent;
