import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect hanya dashboard & turunannya
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // ❗ Middleware HANYA cek token cookie (optional)
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};