/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { resetPasswordZodSchema, IResetPasswordPayload } from "@/zod/auth.validation";

export type IResetPasswordActionSuccess = {
  success: true;
  message: string;
  redirectPath: string;
};

export type IResetPasswordActionResult = IResetPasswordActionSuccess | ApiErrorResponse;

export const resetPasswordAction = async (
  payload: IResetPasswordPayload,
): Promise<IResetPasswordActionResult> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<any>(
      "/auth/reset-password",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to reset password",
      };
    }

    return {
      success: true,
      message: response.message || "Password reset successfully",
      redirectPath: "/login",
    };
  } catch (error: any) {
    console.error("Reset password failed:", error);
    return {
      success: false,
      message: `Reset password failed: ${error?.response?.data?.message || error?.message || "Unknown error"}`,
    };
  }
};
