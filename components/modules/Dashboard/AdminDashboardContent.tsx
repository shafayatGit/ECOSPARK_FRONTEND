"use client";

import AdminDashboardSkeleton from "@/components/modules/Dashboard/Admin/AdminDashboardSkeleton";
import DashboardCharts from "@/components/modules/Dashboard/Admin/DashboardCharts";
import DashboardOverviewCards from "@/components/modules/Dashboard/Admin/DashboardOverviewCards";
import {
  RecentPurchasesTable,
  RecentUsersTable,
} from "@/components/modules/Dashboard/Admin/RecentActivityTables";
import TopIdeasSection from "@/components/modules/Dashboard/Admin/TopIdeasSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/service/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";

const AdminDashboardContent = () => {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !response?.success || !response.data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle />
          <AlertDescription>
            {response?.message ||
              "Unable to load dashboard data. Please try again."}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={isFetching ? "animate-spin" : ""}
            data-icon="inline-start"
          />
          Retry
        </Button>
      </div>
    );
  }

  const { overview, ideasByStatus, ideasByCategory, purchasesByStatus, trends, recent, topIdeas } =
    response.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of users, ideas, engagement, and revenue across EcoSpark.
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

      <DashboardOverviewCards overview={overview} />

      <DashboardCharts
        ideasByStatus={ideasByStatus}
        ideasByCategory={ideasByCategory}
        purchasesByStatus={purchasesByStatus}
        trends={trends}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RecentUsersTable users={recent.recentUsers} />
        <RecentPurchasesTable purchases={recent.recentPurchases} />
      </div>

      <TopIdeasSection
        byVotes={topIdeas.byVotes}
        byPurchases={topIdeas.byPurchases}
      />
    </div>
  );
};

export default AdminDashboardContent;
