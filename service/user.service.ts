/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { UserInfo, UserStatus } from "@/types/user.types";
import { IUserListQuery, userListQuerySchema } from "@/zod/listQuery.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

export async function getUsers(
  query: IUserListQuery = {},
): Promise<ListResponse<UserInfo>> {
  try {
    const parsed = userListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
        data: [],
      };
    }

    return await httpClient.get<UserInfo[]>("/api/admin/users", {
      params: parsed.data,
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch users.",
      data: [],
    };
  }
}

export async function updateUserStatusToActive(userId: string) {
  try {
    return await httpClient.patch<UserInfo>(
      `/api/admin/users/${userId}/activate`,
      {},
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user status: " + "ACTIVE",
      data: null,
    };
  }
}

export async function updateUserStatusToInactive(userId: string) {
  try {
    return await httpClient.patch<UserInfo>(
      `/api/admin/users/${userId}/deactivate`,
      {},
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user status: " + "INACTIVE",
      data: null,
    };
  }
}