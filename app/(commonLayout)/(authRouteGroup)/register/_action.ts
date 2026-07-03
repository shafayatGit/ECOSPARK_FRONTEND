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
  payload: any,
): Promise<IRegisterActionResult> => {
  // Extract image if present
  const { image, ...dataWithoutImage } = payload;

  const parsedPayload = registerZodSchema.safeParse(dataWithoutImage);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  let targetPath = "";

  try {
    // Build FormData for request
    const formData = new FormData();
    formData.append("name", parsedPayload.data.name);
    formData.append("email", parsedPayload.data.email);
    formData.append("password", parsedPayload.data.password);

    // Add image if provided
    if (image instanceof File) {
      formData.append("image", image);
    }

    // Make request with httpClient
    const response = await httpClient.post<any>("/auth/register", formData);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Registration failed",
      };
    }

    targetPath = `/verify-email?email=${encodeURIComponent(parsedPayload.data.email)}`;
  } catch (error: any) {
    console.error("Registration failed:", error);
    const errorMessage =
      error?.response?.data?.message || error?.message || "Unknown error";
    return {
      success: false,
      message: `Registration failed: ${errorMessage}`,
    };
  }

  return {
    success: true,
    redirectPath: targetPath,
  };
};
