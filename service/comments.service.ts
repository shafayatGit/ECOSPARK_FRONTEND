/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { Comment } from "@/types/comment.types";
import {
  createCommentSchema,
  ICreateCommentPayload,
} from "@/zod/comment.validation";

export async function getComments(ideaId: string) {
  try {
    return await httpClient.get<Comment[]>(`/api/comments/idea/${ideaId}`);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch comments.",
      data: [],
    };
  }
}

export async function createComment(payload: ICreateCommentPayload) {
  try {
    const parsed = createCommentSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid comment data.",
        data: null,
      };
    }

    return await httpClient.post<Comment>("/api/comments", parsed.data);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to post comment.",
      data: null,
    };
  }
}

export async function deleteComment(commentId: string) {
  try {
    return await httpClient.delete<{ id: string }>(
      `/api/comments/${commentId}`,
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete comment.",
      data: null,
    };
  }
}
