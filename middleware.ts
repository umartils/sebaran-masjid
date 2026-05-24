import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Jika sudah login tapi akses halaman login/register → redirect ke /input
    if (
      token &&
      (pathname.startsWith("/login") ||
        pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(
        new URL("/input", req.url)
      );
    }

    // Proteksi route admin — hanya role "admin" yang boleh akses
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/input", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Tentukan kapan middleware dijalankan
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Route publik — selalu izinkan tanpa token
        const publicRoutes = ["/", "/login", "/register"];
        const isPublic = publicRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (isPublic) return true;

        // Route lainnya wajib login
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua route KECUALI:
     * - _next/static (file statis)
     * - _next/image  (optimasi gambar)
     * - favicon.ico
     * - assets publik
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};