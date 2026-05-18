import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl

    // Operator routes: chỉ cần có session cookie là cho qua
    // Role check thực sự nằm trong layout (Node runtime)
    if (pathname.startsWith('/quan-ly')) {
      const hasSession =
        req.cookies.has('next-auth.session-token') ||
        req.cookies.has('__Secure-next-auth.session-token') ||
        req.cookies.has('authjs.session-token') ||
        req.cookies.has('authjs.secure.session-token')

      if (!hasSession) {
        return NextResponse.redirect(new URL('/dang-nhap', req.url))
      }
    }

    // Shadow routes: pass through, layout tự xử lý auth + role
    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}
