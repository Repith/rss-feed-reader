import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwtWithoutVerify } from "./src/lib/token";

export async function middleware(request: NextRequest) {
  const protectedRoutes = [
    "/api/feeds",
    "/api/articles",
    "/dashboard",
  ];

  const requiresAuth = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!requiresAuth) return NextResponse.next();

  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return handleUnauthorized(request);
  }

  const decoded = decodeJwtWithoutVerify(token);
  if (!decoded || !decoded.userId) {
    return handleUnauthorized(request);
  }

  return NextResponse.next();
}

function handleUnauthorized(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  } else {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/api/feeds/:path*",
    "/api/articles/:path*",
    "/dashboard/:path*",
  ],
};
