import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const verifyEmailToken = req.cookies.get('verifyEmail')?.value;
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ['/login', '/signup'];
  const verifyEmailRoute = '/verify-email';

  // --- Public routes like login/signup ---
  if (publicRoutes.includes(pathname)) {
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
        // Logged-in user should not access login/signup
        return NextResponse.redirect(new URL('/', req.url));
      } catch {
        // Token invalid, allow access to login/signup
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // --- Verify email page ---
  if (pathname === verifyEmailRoute) {
    if (!token && verifyEmailToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  // --- All other routes require token ---
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return NextResponse.next();
  } catch {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Match all pages except Next.js internals and api
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
