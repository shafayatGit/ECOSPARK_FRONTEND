/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { adminDashboardDataSchema } from "@/zod/dashboard.validation";

export async function getDashboardData(): Promise<
  ApiResponse<IAdminDashboardData | null>
> {
  try {
    const response = await httpClient.get<IAdminDashboardData>(
      "/api/admin/stats",
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to fetch dashboard data.",
        data: null,
      };
    }

    const parsed = adminDashboardDataSchema.safeParse(response.data);

    if (!parsed.success) {
      console.error("Dashboard data validation failed:", parsed.error.issues);
      return {
        success: false,
        message: "Received invalid dashboard data from the server.",
        data: null,
      };
    }

    return {
      success: true,
      message: response.message,
      data: parsed.data,
    };
  } catch (error: any) {
    console.log(error, "From Dashboard Server Action");
    return {
      success: false,
      message:
        error.message || "An error occurred while fetching dashboard data.",
      data: null,
    };
  }
}
