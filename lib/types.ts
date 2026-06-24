export type MenuCategoryKey =
  | "cocktails"
  | "spirits"
  | "wines"
  | "beer"
  | "soft";

export type MenuCategory = {
  key: MenuCategoryKey;
  label: string;
  count: string;
};

export type MenuItem = {
  id: string;
  category: MenuCategoryKey;
  name: string;
  price: number;
  desc: string;
};

export type CartItem = MenuItem & {
  qty: number;
};

export type OrderStatus =
  | "new"
  | "preparing"
  | "served"
  | "paid"
  | "cancelled";

export type OrderItem = {
  id: string;
  orderId?: string;
  itemId?: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  ref: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type CreateOrderPayload = {
  customerName: string;
  tableNumber: string;
  items: {
    id: string;
    name: string;
    price: number;
    qty: number;
  }[];
};