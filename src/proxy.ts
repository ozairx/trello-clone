import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { env } from "@/env";

/**
 * Middleware for authentication and security headers.
 *
 * RESPONSIBILITIES:
 * - Redirects unauthenticated users from protected routes
 * - Redirects authenticated users away from auth pages
 * - Sets security headers on all responses
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: env.AUTH_SECRET });
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/u");

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    // TODO: Get the username from the token. For now, redirect to testuser's boards.
    // This needs to be dynamic.
    return NextResponse.redirect(
      new URL(`/u/${token.username}/boards`, request.url),
    );
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
