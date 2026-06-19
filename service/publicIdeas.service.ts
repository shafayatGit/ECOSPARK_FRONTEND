/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { PublicIdea, PublicIdeaDetail } from "@/types/idea.types";
import {
  IPublicIdeaListQuery,
  publicIdeaListQuerySchema,
} from "@/zod/listQuery.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchIdeaPreviewWithoutAuth(
  ideaId: string,
): Promise<ApiResponse<PublicIdeaDetail>> {
  const res = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const body = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: body?.message || "Failed to fetch idea preview.",
      data: null as unknown as PublicIdeaDetail,
    };
  }

  return body;
}

export async function getPublicIdeas(
  query: IPublicIdeaListQuery = {},
): Promise<ListResponse<PublicIdea>> {
  try {
    const parsed = publicIdeaListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
        data: [],
      };
    }

    return await httpClient.get<PublicIdea[]>("/api/ideas", {
      params: parsed.data,
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ideas.",
      data: [],
    };
  }
}

export async function getPublicIdeaById(ideaId: string) {
  try {
    return await httpClient.get<PublicIdeaDetail>(`/api/ideas/${ideaId}`);
  } catch (error: any) {
    const statusCode = error?.response?.status;

    if (statusCode === 402) {
      const preview = await fetchIdeaPreviewWithoutAuth(ideaId);

      if (preview.success && preview.data) {
        return {
          success: true,
          message: preview.message || "Purchase required for full content.",
          data: {
            ...preview.data,
            hasFullAccess: false,
            paymentRequired: true,
          },
        };
      }

      return {
        success: false,
        message:
          preview.message ||
          error?.response?.data?.message ||
          "Purchase required to access full content.",
        data: null,
      };
    }

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch idea.",
      data: null,
    };
  }
}
