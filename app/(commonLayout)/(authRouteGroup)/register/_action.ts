/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { registerZodSchema, IRegisterPayload } from "@/zod/auth.validation";

export type IRegisterActionSuccess = {
  success: true;
  redirectPath: string;
};

export type IRegisterActionResult = IRegisterActionSuccess | ApiErrorResponse;

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<IRegisterActionResult> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  let targetPath = "";

  try {
    const response = await httpClient.post<any>(
      "/auth/register",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Registration failed",
      };
    }

    const { accessToken, refreshToken, token } = response.data;
    
    // Save authentication details in cookies
    if (accessToken) await setTokenInCookies("accessToken", accessToken);
    if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
    if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    targetPath = `/verify-email?email=${encodeURIComponent(parsedPayload.data.email)}`;
  } catch (error: any) {
    console.error("Registration failed:", error);
    return {
      success: false,
      message: `Registration failed: ${error?.response?.data?.message || error?.message || "Unknown error"}`,
    };
  }

  return {
    success: true,
    redirectPath: targetPath,
  };
};
