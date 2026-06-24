import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { isDashboardAuthed } from "@/lib/dashboard-auth";
import type { CreateOrderPayload, Order, OrderStatus } from "@/lib/types";

type DbOrderItem = {
  id: string;
  order_id: string;
  item_id: string;
  name: string;
  price: number;
  qty: number;
};

type DbOrder = {
  id: string;
  ref: string;
  customer_name: string;
  table_number: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: DbOrderItem[];
};

function mapOrder(order: DbOrder): Order {
  return {
    id: order.id,
    ref: order.ref,
    customerName: order.customer_name,
    tableNumber: order.table_number,
    total: Number(order.total),
    status: order.status,
    createdAt: order.created_at,
    items: order.order_items.map((item) => ({
      id: item.id,
      orderId: item.order_id,
      itemId: item.item_id,
      name: item.name,
      price: Number(item.price),
      qty: item.qty,
    })),
  };
}

function generateRef() {
  return `#AL-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function GET() {
  const isAuthed = await isDashboardAuthed();

  if (!isAuthed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("orders")
    .select(
      `
      id,
      ref,
      customer_name,
      table_number,
      total,
      status,
      created_at,
      order_items (
        id,
        order_id,
        item_id,
        name,
        price,
        qty
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orders: (data as DbOrder[]).map(mapOrder),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderPayload;

    const customerName = body.customerName?.trim();
    const tableNumber = body.tableNumber?.trim();
    const items = body.items ?? [];

    if (!customerName) {
      return NextResponse.json(
        { message: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!tableNumber) {
      return NextResponse.json(
        { message: "Table number is required" },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { message: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.qty);
    }, 0);

    const { data: createdOrder, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        ref: generateRef(),
        customer_name: customerName,
        table_number: tableNumber,
        total,
        status: "new",
      })
      .select("id, ref, customer_name, table_number, total, status, created_at")
      .single();

    if (orderError || !createdOrder) {
      return NextResponse.json(
        {
          message: "Failed to create order",
          error: orderError?.message,
        },
        { status: 500 }
      );
    }

    const orderItems = items.map((item) => ({
      order_id: createdOrder.id,
      item_id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }));

    const { data: createdItems, error: itemsError } = await supabaseServer
      .from("order_items")
      .insert(orderItems)
      .select("id, order_id, item_id, name, price, qty");

    if (itemsError || !createdItems) {
      await supabaseServer.from("orders").delete().eq("id", createdOrder.id);

      return NextResponse.json(
        {
          message: "Failed to create order items",
          error: itemsError?.message,
        },
        { status: 500 }
      );
    }

    const order: Order = {
      id: createdOrder.id,
      ref: createdOrder.ref,
      customerName: createdOrder.customer_name,
      tableNumber: createdOrder.table_number,
      total: Number(createdOrder.total),
      status: createdOrder.status,
      createdAt: createdOrder.created_at,
      items: createdItems.map((item) => ({
        id: item.id,
        orderId: item.order_id,
        itemId: item.item_id,
        name: item.name,
        price: Number(item.price),
        qty: item.qty,
      })),
    };

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const isAuthed = await isDashboardAuthed();

  if (!isAuthed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseServer
    .from("orders")
    .delete()
    .not("id", "is", null);

  if (error) {
    return NextResponse.json(
      { message: "Failed to clear orders", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}