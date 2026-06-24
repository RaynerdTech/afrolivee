import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_COOKIE_NAME = "afrolive_dashboard_auth";

export function proxy(request: NextRequest) {
  const token = process.env.DASHBOARD_SESSION_TOKEN;
  const authCookie = request.cookies.get(DASHBOARD_COOKIE_NAME)?.value;

  const pathname = request.nextUrl.pathname;

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isLoginRoute = pathname === "/dashboard-login";

  const isAuthed = Boolean(token && authCookie === token);

  if (isDashboardRoute && !isAuthed) {
    const loginUrl = new URL("/dashboard-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAuthed) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard-login"],
};