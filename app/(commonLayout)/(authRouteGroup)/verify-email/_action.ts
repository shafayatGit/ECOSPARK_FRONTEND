/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  verifyEmailZodSchema,
  IVerifyEmailPayload,
} from "@/zod/auth.validation";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { jwtUtils } from "@/lib/jwtUtils";
import { cookies } from "next/headers";

export type IVerifyEmailActionSuccess = {
  success: true;
  redirectPath: string;
};

export type IVerifyEmailActionResult =
  | IVerifyEmailActionSuccess
  | ApiErrorResponse;

export const verifyEmailAction = async (
  payload: IVerifyEmailPayload,
): Promise<IVerifyEmailActionResult> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<any>(
      "/auth/verify-email",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Email verification failed",
      };
    }

    // Determine target dashboard based on user role
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    let role: UserRole = "MEMBER";
    if (accessToken) {
      const decoded = jwtUtils.decodedToken(accessToken);
      if (decoded && decoded.role) {
        role = decoded.role as UserRole;
      }
    }

    return {
      success: true,
      redirectPath: getDefaultDashboardRoute(role),
    };
  } catch (error: any) {
    console.error("Email verification failed:", error);
    return {
      success: false,
      message: `Verification failed: ${error?.response?.data?.message || error?.message || "Unknown error"}`,
    };
  }
};
