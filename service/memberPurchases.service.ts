/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { Purchase } from "@/types/purchase.types";
import {
  IMemberPurchaseListQuery,
  memberPurchaseListQuerySchema,
} from "@/zod/listQuery.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

export async function getMyPurchases(
  query: IMemberPurchaseListQuery = {},
): Promise<ListResponse<Purchase>> {
  try {
    const parsed = memberPurchaseListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
        data: [],
      };
    }

    return await httpClient.get<Purchase[]>("/api/purchases/my", {
      params: parsed.data,
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch your purchases.",
      data: [],
    };
  }
}
