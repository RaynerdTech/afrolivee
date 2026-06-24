import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DASHBOARD_COOKIE_NAME } from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const password = body.password as string;

  const correctPassword = process.env.DASHBOARD_PASSWORD;
  const sessionToken = process.env.DASHBOARD_SESSION_TOKEN;

  if (!correctPassword || !sessionToken) {
    return NextResponse.json(
      { message: "Dashboard auth is not configured." },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json(
      { message: "Incorrect password." },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();

  cookieStore.set(DASHBOARD_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}