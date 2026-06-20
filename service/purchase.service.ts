/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import {
  IAdminDashboardData,
  IPurchaseIdea,
  isPaidOrNot,
} from "@/types/dashboard.types";
import { Purchase } from "@/types/purchase.types";
import {
  IPurchaseListQuery,
  purchaseListQuerySchema,
} from "@/zod/listQuery.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

export async function getPurchases(
  query: IPurchaseListQuery = {},
): Promise<ListResponse<Purchase | null>> {
  try {
    const parsed = purchaseListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
        data: null,
      };
    }

    const response = await httpClient.get<Purchase[]>("/api/admin/purchases", {
      params: parsed.data,
    });

    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch purchases.",
      data: null,
    };
  }
}

export async function getPurchaseOverview(): Promise<
  ApiResponse<IAdminDashboardData["overview"]["purchases"] | null>
> {
  try {
    const response =
      await httpClient.get<IAdminDashboardData>("/api/admin/stats");

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to fetch purchase overview.",
        data: null,
      };
    }

    return {
      success: true,
      message: response.message,
      data: response.data.overview.purchases,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch purchase overview.",
      data: null,
    };
  }
}

export async function initiatePayment(payload: IPurchaseIdea) {
  const res = await httpClient.post<isPaidOrNot>(
    "/api/purchases/initiate",
    payload,
  );

  return res.data;
}
