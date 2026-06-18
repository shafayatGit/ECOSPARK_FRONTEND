import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValidRedirectForRole,
  UserRole,
} from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getUserInfo } from "./service/auth.service";

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl; // eg /dashboard, /admin/dashboard, /doctor/dashboard
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET;

    let decodedAccessToken = null;
    let isValidAccessToken = false;

    if (accessToken) {
      if (jwtSecret) {
        const verifyResult = jwtUtils.verifyToken(accessToken, jwtSecret);
        if (verifyResult.success) {
          decodedAccessToken = verifyResult.data;
          isValidAccessToken = true;
        }
      } else {
        // Fallback to client-side decode and expiration check
        const decoded = jwtUtils.decodedToken(accessToken);
        if (decoded && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
          decodedAccessToken = decoded;
          isValidAccessToken = true;
        }
      }
    }

    let userRole: UserRole | null = null;

    if (decodedAccessToken) {
      userRole = (decodedAccessToken as any).role as UserRole;
      //   console.log(`DecodedAccessToken: ${userRole}`); // Debug log
    }

    const routerOwner = getRouteOwner(pathname);

    const isAuth = isAuthRoute(pathname);

    //proactively refresh token if refresh token exists and access token is expired or about to expire
    if (
      isValidAccessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken!))
    ) {
      const requestHeaders = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }

      return response;
    }

    // Rule - 1 : User is logged in (has access token) and trying to access auth route -> redirect to a safe route
    if (isAuth && isValidAccessToken) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      console.log("RedirectParams:", redirectParam);

      if (pathname === "/login" && redirectParam) {
        const safeRedirect = isValidRedirectForRole(
          redirectParam,
          userRole as UserRole,
        )
          ? redirectParam
          : getDefaultDashboardRoute(userRole as UserRole);

        return NextResponse.redirect(new URL(safeRedirect, request.url));
      }

      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    // Rule - 2 : User is trying to access reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      // case - 1 user has needPasswordChange true
      //no need for case 1 if need password change is handled from change-password page
      if (accessToken && email) {
        const userInfo = await getUserInfo();

        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }

      // Case-2 user coming from forgot password

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-3 User trying to access Public route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    //Rule - Enforcing user to stay in reset password or verify email page if their needPasswordChange or isEmailVerified flags are not satisfied respectively

    if (accessToken) {
      const userInfo = await getUserInfo();

      if (userInfo) {
        // need email verification scenario
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }

          return NextResponse.next();
        }

        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }

        // need password change scenario
        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }

          return NextResponse.next();
        }

        if (!userInfo.needPasswordChange && pathname === "/reset-password") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      } else {
        // Token is invalid/expired on backend
        if (routerOwner !== null) {
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          const response = NextResponse.redirect(loginUrl);
          response.cookies.delete("accessToken");
          response.cookies.delete("refreshToken");
          response.cookies.delete("better-auth.session_token");
          return response;
        }
      }
    }

    // Rule - 5 User trying to access Common protected route -> allow
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    //Rule-6 User trying to visit role based protected but doesn't have required role -> redirect to their default dashboard

    if (routerOwner === "ADMIN" || routerOwner === "MEMBER") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
