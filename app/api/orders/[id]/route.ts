import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { isDashboardAuthed } from "@/lib/dashboard-auth";
import type { OrderStatus } from "@/lib/types";

const allowedStatuses: OrderStatus[] = [
  "new",
  "preparing",
  "served",
  "paid",
  "cancelled",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await isDashboardAuthed();

  if (!isAuthed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: OrderStatus };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const status = body.status;

  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { message: "Invalid order status" },
      { status: 400 }
    );
  }

  const { error } = await supabaseServer
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to update order", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}