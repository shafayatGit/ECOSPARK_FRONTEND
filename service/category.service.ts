/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginationMeta } from "@/types/api.types";
import { Category } from "@/types/category.types";
import {
  ICategoryListQuery,
  categoryListQuerySchema,
} from "@/zod/listQuery.validation";
import {
  ICreateCategoryPayload,
  createCategorySchema,
} from "@/zod/category.validation";

type ListResponse<T> = ApiResponse<T[]> & { meta?: PaginationMeta };

export async function getCategories(
  query: ICategoryListQuery = {},
): Promise<ListResponse<Category>> {
  try {
    const parsed = categoryListQuerySchema.safeParse(query);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid query parameters.",
      };
    }

    return await httpClient.get<Category[]>("/api/categories", {
      params: parsed.data,
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch categories.",
    };
  }
}

export async function createCategory(payload: ICreateCategoryPayload) {
  try {
    const parsed = createCategorySchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid category data.",
      };
    }

    return await httpClient.post<Category>("/api/categories", parsed.data);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create category.",
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    return await httpClient.delete<{ id: string }>(
      `/api/categories/${categoryId}`,
    );
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete category.",
    };
  }
}
