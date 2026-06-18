/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export type ILoginActionSuccess = {
  success: true;
  redirectPath: string;
  data?: ILoginResponse;
};

export type ILoginActionResult = ILoginActionSuccess | ApiErrorResponse;

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginActionResult> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  let targetPath = "";

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Login failed",
      };
    }

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needPasswordChange, email } = user.user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

    if (needPasswordChange) {
      targetPath = `/reset-password?email=${encodeURIComponent(email)}`;
    } else {
      targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
    }
  } catch (error: any) {
    console.log(error, "error");

    if (
      error &&
      error.response &&
      error.response.data?.message === "Email not verified"
    ) {
      targetPath = `/verify-email?email=${encodeURIComponent(payload.email)}`;
    } else {
      return {
        success: false,
        message: `Login failed: ${error?.message || "Unknown error"}`,
      };
    }
  }

  return {
    success: true,
    redirectPath: targetPath,
  };
};
