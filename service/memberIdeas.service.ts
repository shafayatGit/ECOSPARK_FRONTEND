/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { MemberIdea } from "@/types/idea.types";
import {
  ICreateIdeaPayload,
  IUpdateIdeaPayload,
  createIdeaSchema,
  updateIdeaSchema,
} from "@/zod/idea.validation";
import {
  IMemberIdeaListQuery,
  memberIdeaListQuerySchema,
} from "@/zod/listQuery.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

export async function getMyIdeas(
  query: IMemberIdeaListQuery = {},
): Promise<ListResponse<MemberIdea>> {
  try {
    const parsed = memberIdeaListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
        data: [],
      };
    }

    return await httpClient.get<MemberIdea[]>("/api/ideas/my", {
      params: parsed.data,
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch your ideas.",
      data: [],
    };
  }
}

export async function getIdeaById(ideaId: string) {
  try {
    return await httpClient.get<MemberIdea>(`/api/ideas/${ideaId}`);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch idea.",
      data: null,
    };
  }
}

export async function createIdea(payload: ICreateIdeaPayload) {
  try {
    const parsed = createIdeaSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid idea data.",
        data: null,
      };
    }

    const body = {
      ...parsed.data,
      ...(parsed.data.isPaid ? {} : { price: undefined }),
    };

    return await httpClient.post<MemberIdea>("/api/ideas", body);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create idea.",
      data: null,
    };
  }
}

export async function updateIdea(ideaId: string, payload: IUpdateIdeaPayload) {
  try {
    const parsed = updateIdeaSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid idea data.",
        data: null,
      };
    }

    const body = {
      ...parsed.data,
      ...(parsed.data.isPaid === false ? { price: undefined } : {}),
    };

    return await httpClient.patch<MemberIdea>(`/api/ideas/${ideaId}`, body);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update idea.",
      data: null,
    };
  }
}

export async function submitIdea(ideaId: string) {
  try {
    return await httpClient.post<MemberIdea>(
      `/api/ideas/${ideaId}/submit`,
      {},
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to submit idea for review.",
      data: null,
    };
  }
}

export async function deleteIdea(ideaId: string) {
  try {
    return await httpClient.delete<{ id: string }>(`/api/ideas/${ideaId}`);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete idea.",
      data: null,
    };
  }
}
