/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { AdminIdea } from "@/types/idea.types";
import {
  IAdminIdeaListQuery,
  adminIdeaListQuerySchema,
} from "@/zod/listQuery.validation";
import { IRejectIdeaPayload, rejectIdeaSchema } from "@/zod/idea.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

export async function getAdminIdeas(
  query: IAdminIdeaListQuery = {},
): Promise<ListResponse<AdminIdea | null>> {
  try {
    const parsed = adminIdeaListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
        data: null,
      };
    }

    const response = await httpClient.get<AdminIdea[]>("/api/admin/ideas", {
      params: parsed.data,
    });

    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ideas.",
      data: null,
    };
  }
}

export async function startIdeaReview(ideaId: string) {
  try {
    return await httpClient.patch<AdminIdea>(
      `/api/admin/ideas/${ideaId}/review`,
      {},
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to start review.",
      data: null,
    };
  }
}

export async function approveIdea(ideaId: string) {
  try {
    return await httpClient.patch<AdminIdea>(
      `/api/admin/ideas/${ideaId}/approve`,
      {},
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to approve idea.",
      data: null,
    };
  }
}

export async function rejectIdea(ideaId: string, payload: IRejectIdeaPayload) {
  try {
    const parsed = rejectIdeaSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid rejection feedback.",
        data: null,
      };
    }

    return await httpClient.patch<AdminIdea>(
      `/api/admin/ideas/${ideaId}/reject`,
      parsed.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reject idea.",
      data: null,
    };
  }
}
