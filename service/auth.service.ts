"use server";

import { cookies } from "next/headers";
import { setTokenInCookies } from "../lib/tokenUtils";
import { UserInfo, UserProfile } from "@/types/user.types";
import {
  IChangePasswordPayload,
  IUpdateProfilePayload,
  changePasswordSchema,
  updateProfileSchema,
} from "@/zod/auth.validation";
import { redirect } from "next/navigation";
import { httpClient } from "@/lib/axios/httpClient";
import { formatErrorDisplay } from "@/lib/errorMapping";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const isClient = typeof window !== "undefined";

async function getAuthCookieHeader() {
  if (isClient) {
    return document.cookie || "";
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function buildJsonRequestHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (!isClient) {
    const cookieHeader = await getAuthCookieHeader();
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
  }

  return headers;
}

// export async function getNewTokensWithRefreshToken(
//   refreshToken: string,
// ): Promise<boolean> {
//   try {
//     const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `refreshToken=${refreshToken}`,
//       },
//     });

//     if (!res.ok) {
//       return false;
//     }

//     const { data } = await res.json();

//     const { accessToken, refreshToken: newRefreshToken, token } = data;

//     if (accessToken) {
//       await setTokenInCookies("accessToken", accessToken);
//     }

//     if (newRefreshToken) {
//       await setTokenInCookies("refreshToken", newRefreshToken);
//     }

//     if (token) {
//       await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
//     }

//     return true;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return false;
//   }
// }

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function updateUserProfile(data: {
  name?: string;
  image?: File;
}): Promise<{ success: boolean; message: string; data?: UserInfo }> {
  try {
    const formData = new FormData();

    if (data.name) {
      formData.append("name", data.name);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await httpClient.put<UserInfo>("/auth/profile", formData);

    return {
      success: true,
      message: "Profile updated successfully.",
      data: response?.data,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);

    const message = formatErrorDisplay(error, { context: "upload" });

    return {
      success: false,
      message: message || "Failed to update profile.",
    };
  }
}

export async function changePassword(payload: IChangePasswordPayload) {
  const parsed = changePasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid password data.",
      data: null,
    };
  }

  try {
    const headers = isClient
      ? {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      : await buildJsonRequestHeaders();

    const res = await fetch(`${BASE_API_URL}/auth/change-password`, {
      method: "POST",
      headers,
      credentials: isClient ? "include" : undefined,
      body: JSON.stringify({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      const errorMessage = formatErrorDisplay(
        result?.message || "Failed to change password.",
        { context: "general" },
      );
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }

    return {
      success: true,
      message: "Password changed successfully.",
      data: result,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to change password.";
    return {
      success: false,
      message,
      data: null,
    };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (sessionToken) {
    try {
      const headers = isClient
        ? {
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        : await buildJsonRequestHeaders();

      await fetch(`${BASE_API_URL}/auth/logout`, {
        method: "POST",
        headers,
        credentials: isClient ? "include" : undefined,
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }

  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/login");
}
