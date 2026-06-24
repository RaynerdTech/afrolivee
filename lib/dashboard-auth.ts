import { cookies } from "next/headers";

export const DASHBOARD_COOKIE_NAME = "afrolive_dashboard_auth";

export async function isDashboardAuthed() {
  const cookieStore = await cookies();
  const token = process.env.DASHBOARD_SESSION_TOKEN;

  if (!token) return false;

  return cookieStore.get(DASHBOARD_COOKIE_NAME)?.value === token;
}