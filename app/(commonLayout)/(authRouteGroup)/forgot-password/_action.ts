/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { forgotPasswordZodSchema, IForgotPasswordPayload } from "@/zod/auth.validation";

export type IForgotPasswordActionSuccess = {
  success: true;
  message: string;
  redirectPath: string;
};

export type IForgotPasswordActionResult = IForgotPasswordActionSuccess | ApiErrorResponse;

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload,
): Promise<IForgotPasswordActionResult> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<any>(
      "/auth/forget-password",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to process request",
      };
    }

    const targetPath = `/reset-password?email=${encodeURIComponent(parsedPayload.data.email)}`;

    return {
      success: true,
      message: response.message || "Password reset OTP sent successfully",
      redirectPath: targetPath,
    };
  } catch (error: any) {
    console.error("Forgot password request failed:", error);
    return {
      success: false,
      message: `Request failed: ${error?.response?.data?.message || error?.message || "Unknown error"}`,
    };
  }
};
