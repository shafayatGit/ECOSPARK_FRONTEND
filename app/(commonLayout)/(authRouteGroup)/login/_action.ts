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

    if (!response?.success || !response.data) {
      const errorMessage = response?.message || "Login failed";

      // Provide specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;

      if (
        errorMessage.toLowerCase().includes("email") &&
        errorMessage.toLowerCase().includes("not found")
      ) {
        userFriendlyMessage =
          "Email address not found. Please check your email or create a new account.";
      } else if (
        errorMessage.toLowerCase().includes("password") &&
        errorMessage.toLowerCase().includes("incorrect")
      ) {
        userFriendlyMessage = "Incorrect password. Please try again.";
      } else if (errorMessage.toLowerCase().includes("invalid credentials")) {
        userFriendlyMessage =
          "Invalid email or password. Please check and try again.";
      } else if (
        errorMessage.toLowerCase().includes("account disabled") ||
        errorMessage.toLowerCase().includes("suspended")
      ) {
        userFriendlyMessage =
          "Your account has been disabled. Please contact support.";
      }

      return {
        success: false,
        message: userFriendlyMessage,
      };
    }

    // console.log(response.data.accessToken);
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

    const errorMessage =
      error?.response?.data?.message || error?.message || "Login failed";

    // Handle specific error scenarios
    if (errorMessage === "Email not verified") {
      targetPath = `/verify-email?email=${encodeURIComponent(payload.email)}`;
      return {
        success: true,
        redirectPath: targetPath,
      };
    } else if (errorMessage.toLowerCase().includes("too many attempts")) {
      return {
        success: false,
        message:
          "Too many login attempts. Please try again later or reset your password.",
      };
    } else if (
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("connection")
    ) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } else if (
      errorMessage.toLowerCase().includes("email") &&
      errorMessage.toLowerCase().includes("not found")
    ) {
      return {
        success: false,
        message:
          "Email address not found. Please check your email or create a new account.",
      };
    } else if (
      errorMessage.toLowerCase().includes("password") &&
      errorMessage.toLowerCase().includes("incorrect")
    ) {
      return {
        success: false,
        message: "Incorrect password. Please try again.",
      };
    } else if (errorMessage.toLowerCase().includes("invalid")) {
      return {
        success: false,
        message: "Invalid email or password. Please check and try again.",
      };
    }

    return {
      success: false,
      message: `Login failed: ${errorMessage}`,
    };
  }

  return {
    success: true,
    redirectPath: targetPath,
  };
};
