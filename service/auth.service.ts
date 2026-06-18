"use server";

import { cookies } from "next/headers";
import { setTokenInCookies } from "../lib/tokenUtils";
import { UserProfile } from "@/types/user.types";
import {
  IChangePasswordPayload,
  IUpdateProfilePayload,
  changePasswordSchema,
  updateProfileSchema,
} from "@/zod/auth.validation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function getAuthCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
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

export async function updateProfile(payload: IUpdateProfilePayload) {
  const parsed = updateProfileSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid profile data.",
      data: null,
    };
  }

  try {
    const res = await fetch(`${BASE_API_URL}/api/auth/update-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getAuthCookieHeader(),
      },
      body: JSON.stringify(parsed.data),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Failed to update profile.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Profile updated successfully.",
      data: result,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile.";
    return {
      success: false,
      message,
      data: null,
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
    const res = await fetch(`${BASE_API_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getAuthCookieHeader(),
      },
      body: JSON.stringify({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Failed to change password.",
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
  try {
    const res = await fetch(`${BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getAuthCookieHeader(),
      },
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to log out.",
      };
    }

    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to log out.";
    return {
      success: false,
      message,
    };
  }
}
