/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IdeaVote } from "@/types/vote.types";
import { castVoteSchema, ICastVotePayload } from "@/zod/vote.validation";

export async function castVote(payload: ICastVotePayload) {
  try {
    const parsed = castVoteSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid vote data.",
        data: null,
      };
    }

    return await httpClient.post<IdeaVote>("/api/votes", parsed.data);
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to cast vote.",
      data: null,
    };
  }
}

export async function removeVote(ideaId: string) {
  try {
    return await httpClient.delete<{ ideaId: string; removed: boolean }>(
      `/api/votes/${ideaId}`,
    );
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to remove vote.",
      data: null,
    };
  }
}

export async function getMyVote(ideaId: string) {
  try {
    return await httpClient.get<IdeaVote | null>(`/api/votes/${ideaId}`);
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch vote.",
      data: null,
    };
  }
}
