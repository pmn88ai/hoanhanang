import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;
  const SHADOW_SLUG = process.env.SHADOW_SLUG ?? "shadow-admin";
  const OPERATOR_PREFIX = "/quan-ly";

  // Shadow admin routes — nếu chưa auth, pass through để layout hiển thị form login
  if (pathname.startsWith(`/${SHADOW_SLUG}`)) {
    if (!token) {
      return NextResponse.next();
    }
    if (token.role !== "shadow_admin") {
      return NextResponse.redirect(new URL("/quan-ly", req.url));
    }
    return NextResponse.next();
  }

  // Operator routes — shadow_admin không được vào
  if (pathname.startsWith(OPERATOR_PREFIX)) {
    if (token?.role === "shadow_admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
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
