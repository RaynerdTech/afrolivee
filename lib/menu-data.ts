// lib/menu-data.ts

import type { MenuCategory, MenuItem, MenuCategoryKey } from "./types";

export const categories: MenuCategory[] = [
  {
    key: "cocktails",
    label: "Signature Cocktails",
    count: "3 items",
  },
  {
    key: "spirits",
    label: "Spirits",
    count: "5 items",
  },
  {
    key: "wines",
    label: "Wines",
    count: "3 items",
  },
  {
    key: "beer",
    label: "Beer",
    count: "2 items",
  },
  {
    key: "soft",
    label: "Soft Drinks",
    count: "5 items",
  },
];

export const menuItems: MenuItem[] = [
  {
    id: "long-island-iced-tea",
    category: "cocktails",
    name: "Long Island Iced Tea",
    price: 12,
    desc: "Vodka, White Rum, Gin, Triple Sec, Lemonade & Cola",
  },
  {
    id: "the-woo",
    category: "cocktails",
    name: "The Woo",
    price: 10,
    desc: "Vodka, Peach Schnapps & Cranberry Juice",
  },
  {
    id: "sex-on-the-beach",
    category: "cocktails",
    name: "Sex on the Beach",
    price: 10,
    desc: "Vodka, Peach Schnapps, Cranberry & Orange Juice",
  },
  {
    id: "smirnoff-vodka",
    category: "spirits",
    name: "Smirnoff Vodka",
    price: 7,
    desc: "Served as a shot",
  },
  {
    id: "tequila",
    category: "spirits",
    name: "Tequila",
    price: 7,
    desc: "Served as a shot",
  },
  {
    id: "jack-daniels",
    category: "spirits",
    name: "Jack Daniel's",
    price: 7,
    desc: "Served as a shot",
  },
  {
    id: "jameson",
    category: "spirits",
    name: "Jameson",
    price: 8,
    desc: "Served as a shot",
  },
  {
    id: "courvoisier",
    category: "spirits",
    name: "Courvoisier",
    price: 10,
    desc: "Served as a shot",
  },
  {
    id: "white-wine",
    category: "wines",
    name: "White Wine",
    price: 8,
    desc: "Served per glass",
  },
  {
    id: "red-wine",
    category: "wines",
    name: "Red Wine",
    price: 8,
    desc: "Served per glass",
  },
  {
    id: "prosecco",
    category: "wines",
    name: "Prosecco",
    price: 8,
    desc: "Sparkling, served per glass",
  },
  {
    id: "corona",
    category: "beer",
    name: "Corona",
    price: 5,
    desc: "Crisp lager",
  },
  {
    id: "heineken",
    category: "beer",
    name: "Heineken",
    price: 5,
    desc: "Dutch premium lager",
  },
  {
    id: "orange-juice",
    category: "soft",
    name: "Orange Juice",
    price: 5,
    desc: "Freshly poured",
  },
  {
    id: "lemonade",
    category: "soft",
    name: "Lemonade",
    price: 5,
    desc: "Refreshing and cold",
  },
  {
    id: "coke",
    category: "soft",
    name: "Coke",
    price: 2.5,
    desc: "Classic Coca-Cola",
  },
  {
    id: "sprite",
    category: "soft",
    name: "Sprite",
    price: 2.5,
    desc: "Lemon & Lime",
  },
  {
    id: "water",
    category: "soft",
    name: "Water",
    price: 2.5,
    desc: "Still mineral water",
  },
];

export function getItemsByCategory(category: MenuCategoryKey) {
  return menuItems.filter((item) => item.category === category);
}

export function getCategoryLabel(category: MenuCategoryKey) {
  return categories.find((item) => item.key === category)?.label ?? "Menu";
}

export function formatPrice(price: number) {
  return price % 1 === 0 ? `£${price}` : `£${price.toFixed(2)}`;
}