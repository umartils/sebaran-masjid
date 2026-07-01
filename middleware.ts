import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function isAdminRole(role?: unknown) {
  return String(role ?? "").toLowerCase() === "admin";
}

const publicRoutes = ["/", "/login", "/register"];
const publicPrefixes = ["/api/auth"];

function isPublicPath(pathname: string) {
  return (
    publicRoutes.includes(pathname) ||
    publicPrefixes.some((route) => pathname.startsWith(route))
  );
}

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (
      token &&
      (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/input", req.url));
    }

    if (pathname.startsWith("/admin") && !isAdminRole(token?.role)) {
      return NextResponse.redirect(new URL("/input", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        if (isPublicPath(pathname)) return true;

        return !!token && !token.expired;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
