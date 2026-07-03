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

export async function createIdea(payload: ICreateIdeaPayload | FormData) {
  try {
    const isFormDataLike =
      typeof payload === "object" &&
      payload !== null &&
      typeof (payload as any).append === "function";

    let body: any = payload;
    if (!isFormDataLike) {
      const parsed = createIdeaSchema.safeParse(payload);

      if (!parsed.success) {
        return {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid idea data.",
          data: null,
        };
      }

      body = {
        ...parsed.data,
        ...(parsed.data.isPaid ? {} : { price: undefined }),
      };
    }

    return await httpClient.post<MemberIdea>("/api/ideas", body, {
      timeout: 120000,
    });
  } catch (error: any) {
    // If server returned structured error (e.g., Zod validation), forward it
    const serverData = error?.response?.data;
    if (serverData && typeof serverData === "object") {
      return {
        success: serverData.success ?? false,
        message:
          serverData.message ||
          serverData.error ||
          error.message ||
          "Failed to create idea.",
        data: serverData.data ?? null,
        // include any extra fields like errorSources for the UI
        ...(serverData.errorSources
          ? { errorSources: serverData.errorSources }
          : {}),
      } as any;
    }

    return {
      success: false,
      message: error.message || "Failed to create idea.",
      data: null,
    };
  }
}

export async function updateIdea(
  ideaId: string,
  payload: IUpdateIdeaPayload | FormData,
) {
  try {
    let body: any = payload;
    if (!(payload instanceof FormData)) {
      const parsed = updateIdeaSchema.safeParse(payload);

      if (!parsed.success) {
        return {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid idea data.",
          data: null,
        };
      }

      body = {
        ...parsed.data,
        ...(parsed.data.isPaid === false ? { price: undefined } : {}),
      };
    }

    return await httpClient.patch<MemberIdea>(`/api/ideas/${ideaId}`, body, {
      timeout: 120000,
    });
  } catch (error: any) {
    const serverData = error?.response?.data;
    if (serverData && typeof serverData === "object") {
      return {
        success: serverData.success ?? false,
        message:
          serverData.message ||
          serverData.error ||
          error.message ||
          "Failed to update idea.",
        data: serverData.data ?? null,
        ...(serverData.errorSources
          ? { errorSources: serverData.errorSources }
          : {}),
      } as any;
    }

    return {
      success: false,
      message: error.message || "Failed to update idea.",
      data: null,
    };
  }
}

export async function submitIdea(ideaId: string) {
  try {
    return await httpClient.post<MemberIdea>(`/api/ideas/${ideaId}/submit`, {});
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
