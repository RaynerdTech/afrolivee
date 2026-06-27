// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import {
//   categories,
//   formatPrice,
//   getCategoryLabel,
//   getItemsByCategory,
// } from "@/lib/menu-data";
// import type { CartItem, MenuCategoryKey, MenuItem, Order } from "@/lib/types";

// type Screen = "home" | "list" | "detail" | "order" | "confirm";

// const icons: Record<MenuCategoryKey, ReactNode> = {
//   cocktails: (
//     <>
//       <path d="M8 22h8M12 11v11M3 3l9 8 9-8H3zM7 3l5 4.5L17 3" />
//     </>
//   ),
//   spirits: (
//     <>
//       <path d="M9 3h6l1 7H8L9 3zM8 10c0 5 8 5 8 0M10 17v-4M14 17v-4M8 17h8a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" />
//     </>
//   ),
//   wines: (
//     <>
//       <path d="M8 22h8M12 11v11M5 3h14l-1.5 8A5 5 0 0 1 12 16a5 5 0 0 1-5.5-5L5 3z" />
//     </>
//   ),
//   beer: (
//     <>
//       <path d="M17 11h1a3 3 0 0 1 0 6h-1M5 11h12v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11zM9 3v8M12 3v8M5 8h14" />
//     </>
//   ),
//   soft: (
//     <>
//       <path d="M8 3h8l1 7H7L8 3zM7 10v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9M12 3v18M9 7h6" />
//     </>
//   ),
// };

// function CartIcon() {
//   return (
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="9" cy="21" r="1" />
//       <circle cx="20" cy="21" r="1" />
//       <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//     </svg>
//   );
// }

// function FooterBar() {
//   return (
//     <footer className="flex shrink-0 justify-center gap-10 border-t border-[var(--border-soft)] bg-[var(--panel-bg)] px-5 py-3">
//       <FooterItem label="Live Music">
//         <path d="M9 18V5l12-2v13" />
//         <circle cx="6" cy="18" r="3" />
//         <circle cx="18" cy="16" r="3" />
//       </FooterItem>

//       <FooterItem label="Good Drinks">
//         <path d="M8 22h8M12 11v11M5 3h14l-1.5 8A5 5 0 0 1 12 16a5 5 0 0 1-5.5-5L5 3z" />
//       </FooterItem>

//       <FooterItem label="Good Vibes">
//         <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
//       </FooterItem>
//     </footer>
//   );
// }

// function FooterItem({
//   label,
//   children,
// }: {
//   label: string;
//   children: ReactNode;
// }) {
//   return (
//     <div className="flex flex-col items-center gap-1 text-center text-[8px] uppercase tracking-[1.5px] text-[var(--text-muted)]">
//       <svg
//         viewBox="0 0 24 24"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="h-4 w-4 fill-none stroke-current"
//       >
//         {children}
//       </svg>
//       {label}
//     </div>
//   );
// }

// function Header({
//   subtitle,
//   showBack,
//   showCart,
//   cartCount,
//   onBack,
//   onCart,
// }: {
//   subtitle?: string;
//   showBack?: boolean;
//   showCart?: boolean;
//   cartCount?: number;
//   onBack?: () => void;
//   onCart?: () => void;
// }) {
//   return (
//     <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b border-[var(--border-soft)] bg-[var(--panel-bg)] px-5 py-3.5">
//       {showBack ? (
//         <button
//           type="button"
//           onClick={onBack}
//           aria-label="Back"
//           className="flex shrink-0 items-center border-0 bg-transparent p-0 text-[22px] leading-none text-[var(--gold)]"
//         >
//           ←
//         </button>
//       ) : null}

//       <div className="flex-1">
//         <div className="font-display text-2xl leading-none tracking-wide text-[var(--text-main)]">
//           afro<span className="text-[var(--gold)]">live</span>
//         </div>
//         {subtitle ? (
//           <div className="mt-0.5 text-[8px] font-medium uppercase tracking-[3px] text-[var(--gold)]">
//             {subtitle}
//           </div>
//         ) : null}
//       </div>

//       {showCart ? (
//         <button
//           type="button"
//           onClick={onCart}
//           className="flex shrink-0 items-center gap-2 rounded-lg border border-[rgba(244,180,0,0.3)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--gold)]"
//         >
//           <CartIcon />
//           {cartCount && cartCount > 0 ? (
//             <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--gold)] text-[10px] font-bold text-[#0A0A0A]">
//               {cartCount}
//             </span>
//           ) : null}
//         </button>
//       ) : null}
//     </header>
//   );
// }

// export default function MenuPage() {
//   const [screen, setScreen] = useState<Screen>("home");
//   const [currentCategory, setCurrentCategory] =
//     useState<MenuCategoryKey | null>(null);
//   const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
//   const [qty, setQty] = useState(1);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [customerName, setCustomerName] = useState("");
//   const [tableNumber, setTableNumber] = useState("");
//   const [errors, setErrors] = useState({
//     name: false,
//     table: false,
//     cart: false,
//   });
//   const [lastOrder, setLastOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const table = params.get("table");

//     if (table) {
//       setTableNumber(table);
//     }
//   }, []);

//   const cartCount = useMemo(() => {
//     return cart.reduce((sum, item) => sum + item.qty, 0);
//   }, [cart]);

//   const cartTotal = useMemo(() => {
//     return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//   }, [cart]);

//   const categoryItems = useMemo(() => {
//     if (!currentCategory) return [];
//     return getItemsByCategory(currentCategory);
//   }, [currentCategory]);

//   function goToScreen(nextScreen: Screen) {
//     setScreen(nextScreen);
//     window.scrollTo(0, 0);
//   }

//   function openCategory(category: MenuCategoryKey) {
//     setCurrentCategory(category);
//     setCurrentItem(null);
//     goToScreen("list");
//   }

//   function openItem(item: MenuItem) {
//     setCurrentItem(item);
//     setQty(1);
//     goToScreen("detail");
//   }

//   function addToCart() {
//     if (!currentItem) return;

//     setCart((prev) => {
//       const existing = prev.find((item) => item.id === currentItem.id);

//       if (existing) {
//         return prev.map((item) =>
//           item.id === currentItem.id
//             ? {
//                 ...item,
//                 qty: item.qty + qty,
//               }
//             : item
//         );
//       }

//       return [
//         ...prev,
//         {
//           ...currentItem,
//           qty,
//         },
//       ];
//     });

//     setErrors((prev) => ({
//       ...prev,
//       cart: false,
//     }));

//     goToScreen("list");
//   }

//   function updateCartQty(itemId: string, nextQty: number) {
//     const cleanQty = Math.max(1, nextQty);

//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === itemId
//           ? {
//               ...item,
//               qty: cleanQty,
//             }
//           : item
//       )
//     );
//   }

//   function removeCartItem(itemId: string) {
//     setCart((prev) => prev.filter((item) => item.id !== itemId));
//   }

//   function clearCart() {
//     setCart([]);
//     setErrors((prev) => ({
//       ...prev,
//       cart: false,
//     }));
//   }

//   async function placeOrder() {
//     if (isSubmitting) return;

//     const cleanName = customerName.trim();
//     const cleanTable = tableNumber.trim();

//     const nextErrors = {
//       name: !cleanName,
//       table: !cleanTable,
//       cart: cart.length === 0,
//     };

//     setErrors(nextErrors);
//     setSubmitError("");

//     if (nextErrors.name || nextErrors.table || nextErrors.cart) return;

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customerName: cleanName,
//           tableNumber: cleanTable,
//           items: cart.map((item) => ({
//             id: item.id,
//             name: item.name,
//             price: item.price,
//             qty: item.qty,
//           })),
//         }),
//       });

//       const contentType = response.headers.get("content-type");
//       const data = contentType?.includes("application/json")
//         ? await response.json()
//         : { message: "Server returned an unexpected response." };

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to place order");
//       }

//       setLastOrder(data.order);
//       setCart([]);
//       goToScreen("confirm");
//     } catch (error) {
//       setSubmitError(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   function resetOrder() {
//     setCart([]);
//     setCurrentCategory(null);
//     setCurrentItem(null);
//     setQty(1);
//     setErrors({
//       name: false,
//       table: false,
//       cart: false,
//     });
//     setSubmitError("");
//     setLastOrder(null);
//     goToScreen("home");
//   }

//   return (
//     <main className="min-h-screen bg-[var(--app-bg)] text-[var(--text-main)] md:bg-[#050505]">
//       <div className="mx-auto flex min-h-screen max-w-[430px] flex-col overflow-hidden bg-[var(--panel-bg)] md:shadow-[0_0_60px_rgba(0,0,0,0.6)]">
//         {screen === "home" ? (
//           <>
//             <Header
//               subtitle="Live Afrobeats Music"
//               showCart
//               cartCount={cartCount}
//               onCart={() => goToScreen("order")}
//             />

//             <div className="flex-1 overflow-y-auto px-5 py-5">
//               <p className="font-display mb-0.5 text-[30px] tracking-[2px] text-[var(--gold)]">
//                 Drinks Menu
//               </p>
//               <p className="mb-6 text-[10px] uppercase tracking-[2.5px] text-[var(--text-muted)]">
//                 The Village Table, Croydon
//               </p>

//               <div className="grid grid-cols-2 gap-3">
//                 {categories.map((category) => (
//                   <button
//                     key={category.key}
//                     type="button"
//                     onClick={() => openCategory(category.key)}
//                     className={`flex cursor-pointer flex-col gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-bg)] p-[18px_14px] text-left transition hover:border-[var(--gold)] hover:bg-[rgba(244,180,0,0.06)] ${
//                       category.key === "soft" ? "col-span-2" : ""
//                     }`}
//                   >
//                     <svg
//                       className="h-7 w-7 shrink-0 fill-none stroke-[var(--gold)]"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       {icons[category.key]}
//                     </svg>

//                     <div className="font-display text-[17px] leading-[1.1] tracking-[1px] text-[var(--text-main)]">
//                       {category.label}
//                     </div>

//                     <div className="text-[10px] text-[var(--text-muted)]">
//                       {category.count}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <FooterBar />
//           </>
//         ) : null}

//         {screen === "list" ? (
//           <>
//             <Header
//               showBack
//               showCart
//               cartCount={cartCount}
//               onBack={() => goToScreen("home")}
//               onCart={() => goToScreen("order")}
//             />

//             <div className="flex-1 overflow-y-auto px-5 py-5">
//               <div className="font-display mb-1 text-[22px] tracking-[2px] text-[var(--gold)]">
//                 {currentCategory ? getCategoryLabel(currentCategory) : "Menu"}
//               </div>
//               <div className="mb-[18px] h-0.5 w-9 bg-[var(--gold)]" />

//               <div className="flex flex-col">
//                 {categoryItems.map((item) => (
//                   <button
//                     key={item.id}
//                     type="button"
//                     onClick={() => openItem(item)}
//                     className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border-b border-[rgba(244,180,0,0.08)] px-2 py-3.5 text-left transition hover:bg-[var(--surface-bg)]"
//                   >
//                     <div className="flex-1">
//                       <div className="mb-1 text-xs font-semibold uppercase tracking-[0.8px] text-[var(--gold)]">
//                         {item.name}
//                       </div>
//                       <div className="text-[11px] leading-[1.55] text-[var(--text-muted)]">
//                         {item.desc}
//                       </div>
//                     </div>

//                     <div className="font-display shrink-0 text-xl text-[var(--gold)]">
//                       {formatPrice(item.price)}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         ) : null}

//         {screen === "detail" && currentItem && currentCategory ? (
//           <>
//             <Header showBack onBack={() => goToScreen("list")} />

//             <div className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
//               <svg
//                 className="mb-4 h-12 w-12 fill-none stroke-[var(--gold)]"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 {icons[currentCategory]}
//               </svg>

//               <div className="font-display mb-1.5 text-[32px] leading-[1.1] tracking-[2px] text-[var(--text-main)]">
//                 {currentItem.name}
//               </div>

//               <div className="font-display mb-[18px] text-[28px] text-[var(--gold)]">
//                 {formatPrice(currentItem.price)}
//               </div>

//               <div className="mb-7 rounded-lg border-l-[3px] border-[var(--gold)] bg-[var(--surface-bg)] p-3.5 text-[13px] leading-[1.7] text-[var(--text-muted)]">
//                 {currentItem.desc}
//               </div>

//               <div className="mb-6 flex items-center gap-4">
//                 <span className="text-[13px] text-[var(--text-muted)]">
//                   Quantity
//                 </span>

//                 <div className="flex items-center overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--surface-bg)]">
//                   <button
//                     type="button"
//                     onClick={() => setQty((value) => Math.max(1, value - 1))}
//                     className="flex h-10 w-10 items-center justify-center border-0 bg-transparent text-xl text-[var(--gold)]"
//                     aria-label="Decrease"
//                   >
//                     −
//                   </button>

//                   <span className="min-w-9 text-center text-base font-semibold text-[var(--text-main)]">
//                     {qty}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => setQty((value) => value + 1)}
//                     className="flex h-10 w-10 items-center justify-center border-0 bg-transparent text-xl text-[var(--gold)]"
//                     aria-label="Increase"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={addToCart}
//                 className="font-display w-full rounded-lg border-0 bg-[var(--gold)] px-5 py-[15px] text-center text-lg tracking-[2px] text-[#0A0A0A] transition hover:opacity-90"
//               >
//                 Add to Order
//               </button>
//             </div>
//           </>
//         ) : null}

//         {screen === "order" ? (
//           <>
//             <Header
//               subtitle="Your Order"
//               showBack
//               onBack={() => goToScreen("home")}
//             />

//             <div className="flex-1 overflow-y-auto px-5 py-5">
//               <div className="flex items-center justify-between gap-3">
//                 <div>
//                   <div className="font-display mb-1 text-[22px] tracking-[2px] text-[var(--gold)]">
//                     Your Order
//                   </div>
//                   <div className="mb-[18px] h-0.5 w-9 bg-[var(--gold)]" />
//                 </div>

//                 {cart.length > 0 ? (
//                   <button
//                     type="button"
//                     onClick={clearCart}
//                     className="rounded-lg border border-red-500/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1px] text-red-500"
//                   >
//                     Clear
//                   </button>
//                 ) : null}
//               </div>

//               {cart.length === 0 ? (
//                 <div className="px-5 py-[50px] text-center text-[13px] leading-[1.7] text-[var(--text-muted)]">
//                   No items yet.
//                   <br />
//                   Head back and pick your drinks.
//                 </div>
//               ) : (
//                 <div>
//                   {cart.map((item) => (
//                     <div
//                       key={item.id}
//                       className="border-b border-[rgba(244,180,0,0.08)] py-3"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <div className="text-[13px] font-medium text-[var(--text-main)]">
//                             {item.name}
//                           </div>
//                           <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
//                             {formatPrice(item.price)} each
//                           </div>
//                         </div>

//                         <div className="font-display shrink-0 text-lg text-[var(--gold)]">
//                           {formatPrice(item.price * item.qty)}
//                         </div>
//                       </div>

//                       <div className="mt-3 flex items-center justify-between gap-3">
//                         <div className="flex items-center overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--surface-bg)]">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               updateCartQty(item.id, item.qty - 1)
//                             }
//                             className="flex h-8 w-9 items-center justify-center border-0 bg-transparent text-lg text-[var(--gold)]"
//                             aria-label={`Decrease ${item.name}`}
//                           >
//                             −
//                           </button>

//                           <span className="min-w-8 text-center text-sm font-semibold text-[var(--text-main)]">
//                             {item.qty}
//                           </span>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               updateCartQty(item.id, item.qty + 1)
//                             }
//                             className="flex h-8 w-9 items-center justify-center border-0 bg-transparent text-lg text-[var(--gold)]"
//                             aria-label={`Increase ${item.name}`}
//                           >
//                             +
//                           </button>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => removeCartItem(item.id)}
//                           className="rounded-lg border border-red-500/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[1px] text-red-500"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="flex items-baseline justify-between pt-3.5">
//                     <span className="text-[11px] uppercase tracking-[2px] text-[var(--text-muted)]">
//                       Total
//                     </span>
//                     <span className="font-display text-[26px] text-[var(--gold)]">
//                       {formatPrice(cartTotal)}
//                     </span>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => goToScreen("home")}
//                     className="font-display mt-4 w-full rounded-lg border border-[var(--gold)] bg-transparent px-5 py-3 text-center text-base tracking-[2px] text-[var(--gold)] transition hover:bg-[rgba(244,180,0,0.08)]"
//                   >
//                     Add More Drinks
//                   </button>
//                 </div>
//               )}

//               {errors.cart ? (
//                 <p className="mt-3 text-[11px] text-[var(--error)]">
//                   Please add at least one item before placing an order.
//                 </p>
//               ) : null}

//               <div className="mt-[26px] border-t border-[var(--border-soft)] pt-[22px]">
//                 <div className="font-display mb-4 text-lg tracking-[2px] text-[var(--gold)]">
//                   Your Details
//                 </div>

//                 <div className="mb-3.5 flex flex-col gap-1.5">
//                   <label
//                     htmlFor="input-name"
//                     className="text-[10px] font-semibold uppercase tracking-[2px] text-[var(--text-muted)]"
//                   >
//                     Full Name
//                   </label>
//                   <input
//                     id="input-name"
//                     type="text"
//                     value={customerName}
//                     onChange={(event) => setCustomerName(event.target.value)}
//                     placeholder="e.g. Jordan Smith"
//                     autoComplete="name"
//                     className={`w-full rounded-lg border bg-[var(--field-bg)] px-3.5 py-[13px] text-sm text-[var(--text-main)] outline-none transition placeholder:text-[#777]/40 focus:border-[var(--gold)] ${
//                       errors.name
//                         ? "border-[var(--error)]"
//                         : "border-[var(--border-soft)]"
//                     }`}
//                   />
//                   {errors.name ? (
//                     <span className="text-[11px] text-[var(--error)]">
//                       Please enter your full name
//                     </span>
//                   ) : null}
//                 </div>

//                 <div className="mb-3.5 flex flex-col gap-1.5">
//                   <label
//                     htmlFor="input-table"
//                     className="text-[10px] font-semibold uppercase tracking-[2px] text-[var(--text-muted)]"
//                   >
//                     Table Number
//                   </label>
//                   <input
//                     id="input-table"
//                     type="text"
//                     value={tableNumber}
//                     onChange={(event) => setTableNumber(event.target.value)}
//                     placeholder="e.g. 7"
//                     inputMode="numeric"
//                     className={`w-full rounded-lg border bg-[var(--field-bg)] px-3.5 py-[13px] text-sm text-[var(--text-main)] outline-none transition placeholder:text-[#777]/40 focus:border-[var(--gold)] ${
//                       errors.table
//                         ? "border-[var(--error)]"
//                         : "border-[var(--border-soft)]"
//                     }`}
//                   />
//                   {errors.table ? (
//                     <span className="text-[11px] text-[var(--error)]">
//                       Please enter your table number
//                     </span>
//                   ) : null}
//                 </div>
//               </div>

//               <div className="mt-[22px]">
//                 {submitError ? (
//                   <p className="mb-3 text-center text-[12px] text-[var(--error)]">
//                     {submitError}
//                   </p>
//                 ) : null}

//                 <button
//                   type="button"
//                   onClick={placeOrder}
//                   disabled={isSubmitting || cart.length === 0}
//                   className="font-display w-full rounded-lg border-0 bg-[var(--gold)] px-5 py-[15px] text-center text-lg tracking-[2px] text-[#0A0A0A] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Placing Order..." : "Place Order"}
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : null}

//         {screen === "confirm" && lastOrder ? (
//           <>
//             <Header subtitle="Order Confirmed" />

//             <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
//               <svg
//                 className="mb-[18px] h-16 w-16 fill-none stroke-[var(--gold)]"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                 <polyline points="22 4 12 14.01 9 11.01" />
//               </svg>

//               <div className="font-display mb-2 text-4xl tracking-[2px] text-[var(--text-main)]">
//                 Order Placed!
//               </div>

//               <div className="mb-7 text-[13px] leading-[1.7] text-[var(--text-muted)]">
//                 Your drinks are on their way.
//                 <br />
//                 Please pay when served.
//               </div>

//               <div className="mb-7 flex w-full flex-col gap-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-bg)] px-5 py-4 text-left">
//                 <ConfirmRow label="Name" value={lastOrder.customerName} />
//                 <ConfirmRow
//                   label="Table"
//                   value={`Table ${lastOrder.tableNumber}`}
//                 />
//                 <ConfirmRow label="Order ref" value={lastOrder.ref} isRef />
//                 <ConfirmRow label="Total" value={formatPrice(lastOrder.total)} />
//               </div>

//               <button
//                 type="button"
//                 onClick={resetOrder}
//                 className="font-display rounded-lg border border-[var(--gold)] bg-transparent px-8 py-3 text-base tracking-[2px] text-[var(--gold)] transition hover:bg-[rgba(244,180,0,0.08)]"
//               >
//                 Order More Drinks
//               </button>
//             </div>

//             <FooterBar />
//           </>
//         ) : null}
//       </div>
//     </main>
//   );
// }

// function ConfirmRow({
//   label,
//   value,
//   isRef,
// }: {
//   label: string;
//   value: string;
//   isRef?: boolean;
// }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-[10px] uppercase tracking-[1.5px] text-[var(--text-muted)]">
//         {label}
//       </span>
//       <span
//         className={
//           isRef
//             ? "font-display text-xl tracking-[3px] text-[var(--gold)]"
//             : "text-[13px] font-semibold text-[var(--gold)]"
//         }
//       >
//         {value}
//       </span>
//     </div>
//   );
// }


export default function MenuClosedPage() {
  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--text-main)] md:bg-[#050505]">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col overflow-hidden bg-[var(--panel-bg)] md:shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b border-[var(--border-soft)] bg-[var(--panel-bg)] px-5 py-3.5">
          <div className="flex-1">
            <div className="font-display text-2xl leading-none tracking-wide text-[var(--text-main)]">
              afro<span className="text-[var(--gold)]">live</span>
            </div>
            <div className="mt-0.5 text-[8px] font-medium uppercase tracking-[3px] text-[var(--gold)]">
              Live Afrobeats Music
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-bg)]">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 fill-none stroke-[var(--gold)]"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
              <path d="M5 5l14 14" />
            </svg>
          </div>

          <p className="font-display text-[34px] leading-none tracking-[2px] text-[var(--gold)]">
            Ordering Paused
          </p>

          <p className="mt-4 max-w-[320px] text-[13px] leading-7 text-[var(--text-muted)]">
            The AfroLive ordering menu is temporarily paused. Please speak to a
            member of staff to place your order.
          </p>

          <div className="mt-8 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-bg)] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[var(--text-muted)]">
              Current Status
            </p>
            <p className="font-display mt-1 text-2xl tracking-[2px] text-[var(--gold)]">
              Menu Closed
            </p>
          </div>
        </section>

        <footer className="flex shrink-0 justify-center gap-10 border-t border-[var(--border-soft)] bg-[var(--panel-bg)] px-5 py-3">
          <div className="flex flex-col items-center gap-1 text-center text-[8px] uppercase tracking-[1.5px] text-[var(--text-muted)]">
            Live Music
          </div>
          <div className="flex flex-col items-center gap-1 text-center text-[8px] uppercase tracking-[1.5px] text-[var(--text-muted)]">
            Good Drinks
          </div>
          <div className="flex flex-col items-center gap-1 text-center text-[8px] uppercase tracking-[1.5px] text-[var(--text-muted)]">
            Good Vibes
          </div>
        </footer>
      </div>
    </main>
  );
}