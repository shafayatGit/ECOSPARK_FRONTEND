"use client";

import SearchInput from "@/components/shared/Admin/SearchInput";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import TablePagination from "@/components/shared/Admin/TablePagination";
import UserInfoCell from "@/components/shared/Cell/UserInfoCell";
import DateCell from "@/components/shared/Cell/DataCell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  getUsers,
  updateUserStatusToActive,
  updateUserStatusToInactive,
} from "@/service/user.service";
import { UserInfo } from "@/types/user.types";
import { IUserListQuery } from "@/zod/listQuery.validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  MoreHorizontal,
  RefreshCw,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "MEMBER", label: "Member" },
  { value: "ADMIN", label: "Admin" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const MemberManagementContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, status]);

  const queryParams: IUserListQuery = {
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    ...(role !== "ALL" ? { role: role as any } : {}),
    ...(status !== "ALL" ? { status: status as any } : {}),
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["admin-users", queryParams],
    queryFn: () => getUsers(queryParams),
  });

  const activateMutation = useMutation({
    mutationFn: (userId: string) => updateUserStatusToActive(userId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Member activated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error(res.message || "Failed to activate member");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
    onSettled: () => {
      setActionId(null);
    },
  });

  const inactivateMutation = useMutation({
    mutationFn: (userId: string) => updateUserStatusToInactive(userId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Member deactivated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error(res.message || "Failed to deactivate member");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
    onSettled: () => {
      setActionId(null);
    },
  });

  const handleActivate = (user: UserInfo) => {
    setActionId(user.id);
    activateMutation.mutate(user.id);
  };

  const handleInactivate = (user: UserInfo) => {
    setActionId(user.id);
    inactivateMutation.mutate(user.id);
  };

  const renderActions = (user: UserInfo) => {
    const isActing = actionId === user.id;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            disabled={isActing}
          >
            {isActing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={user.status === "ACTIVE" || isActing}
            onClick={() => handleActivate(user)}
            className="text-primary focus:text-primary"
          >
            {user.status === "ACTIVE" ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <UserCheck className="mr-2 h-4 w-4" />
            )}
            Activate Member
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={user.status === "INACTIVE" || isActing}
            onClick={() => handleInactivate(user)}
            className="text-destructive focus:text-destructive"
          >
            {user.status === "INACTIVE" ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <UserX className="mr-2 h-4 w-4" />
            )}
            Deactivate Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const users = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Member Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage user accounts and their access status.
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
            <div className="flex flex-1 items-center gap-3">
              <div className="w-full max-w-sm">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name or email..."
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px]">
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
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load users. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No users found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {debouncedSearch || role !== "ALL" || status !== "ALL"
                    ? "No users match your current filters."
                    : "There are no users registered in the system yet."}
                </p>
                {(debouncedSearch || role !== "ALL" || status !== "ALL") && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearch("");
                      setRole("ALL");
                      setStatus("ALL");
                    }}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <UserInfoCell
                            name={user.name}
                            email={user.email}
                            profilePhoto={user.image ?? undefined}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.role} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell>
                          <DateCell date={user.createdAt} />
                        </TableCell>
                        <TableCell className="text-right">
                          {renderActions(user)}
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

export default MemberManagementContent;
