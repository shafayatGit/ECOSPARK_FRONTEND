"use client";

import { getDashboardData } from "@//service/dashboard.service";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always", // Refetch the data when the window regains focus
  });

  const { data } = adminDashboardData as ApiResponse<IAdminDashboardData>;

  //   console.log(data);
  return <div className="flex flex-wrap"></div>;
};

export default AdminDashboardContent;
