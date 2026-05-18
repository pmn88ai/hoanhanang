import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const SHADOW_SLUG = process.env.SHADOW_SLUG ?? "shadow-admin";
  const OPERATOR_PREFIX = "/quan-ly";

  // Shadow admin routes
  if (pathname.startsWith(`/${SHADOW_SLUG}`)) {
    if (token?.role !== "shadow_admin") {
      return NextResponse.redirect(new URL("/dang-nhap", req.url));
    }
    return NextResponse.next();
  }

  // Operator routes
  if (pathname.startsWith(OPERATOR_PREFIX)) {
    if (!token) {
      return NextResponse.redirect(new URL("/dang-nhap", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|dang-nhap).*)",
  ],
};
