import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const validUser = process.env.ADMIN_USERNAME;
      const validPass = process.env.ADMIN_PASSWORD;

      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    url.pathname = '/api/auth';
    return NextResponse.rewrite(url, {
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
      status: 401,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin'],
};