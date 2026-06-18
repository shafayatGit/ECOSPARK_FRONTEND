"use client";

import StatCard from "@/components/modules/Dashboard/Admin/StatCard";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import DateCell from "@/components/shared/Cell/DataCell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { truncateText } from "@/lib/formatters";
import { getMyIdeas } from "@/service/memberIdeas.service";
import { getMyPurchases } from "@/service/memberPurchases.service";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  Lightbulb,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const MemberDashboardContent = () => {
  const { data: ideasResponse, isLoading: ideasLoading } = useQuery({
    queryKey: ["member-dashboard-ideas"],
    queryFn: () => getMyIdeas({ page: 1, limit: 5, sortBy: "updatedAt", sortOrder: "desc" }),
  });

  const { data: purchasesResponse, isLoading: purchasesLoading } = useQuery({
    queryKey: ["member-dashboard-purchases"],
    queryFn: () =>
      getMyPurchases({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" }),
  });

  const ideas = ideasResponse?.data ?? [];
  const purchases = purchasesResponse?.data ?? [];
  const ideaMeta = ideasResponse?.meta;
  const purchaseMeta = purchasesResponse?.meta;

  const draftCount = ideas.filter((idea) => idea.status === "DRAFT").length;
  const pendingCount = ideas.filter(
    (idea) => idea.status === "PENDING" || idea.status === "UNDER_REVIEW",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your sustainability ideas and purchased content.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create-idea">
            <Plus data-icon="inline-start" />
            Create Idea
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Ideas"
          value={ideasLoading ? "—" : String(ideaMeta?.total ?? ideas.length)}
          icon={Lightbulb}
          description="Ideas you have submitted"
        />
        <StatCard
          title="Drafts"
          value={ideasLoading ? "—" : String(draftCount)}
          icon={ClipboardList}
          description="Ideas not yet submitted"
        />
        <StatCard
          title="In Review"
          value={ideasLoading ? "—" : String(pendingCount)}
          icon={ClipboardList}
          description="Pending or under review"
        />
        <StatCard
          title="Purchases"
          value={
            purchasesLoading ? "—" : String(purchaseMeta?.total ?? purchases.length)
          }
          icon={ShoppingBag}
          description="Ideas you have purchased"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Ideas</CardTitle>
            <Button variant="link" size="sm" asChild className="px-0">
              <Link href="/dashboard/my-ideas">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ideasLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : ideas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No ideas yet.{" "}
                <Link href="/dashboard/create-idea" className="text-primary underline">
                  Create your first idea
                </Link>
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ideas.map((idea) => (
                    <TableRow key={idea.id}>
                      <TableCell>{truncateText(idea.title, 30)}</TableCell>
                      <TableCell>
                        <StatusBadge status={idea.status} />
                      </TableCell>
                      <TableCell>
                        <DateCell date={idea.updatedAt} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Purchases</CardTitle>
            <Button variant="link" size="sm" asChild className="px-0">
              <Link href="/dashboard/my-purchases">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {purchasesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : purchases.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No purchases yet. Browse approved ideas to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Idea</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        {truncateText(purchase.idea.title, 30)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={purchase.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <DateCell
                          date={purchase.completedAt || purchase.createdAt}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboardContent;
