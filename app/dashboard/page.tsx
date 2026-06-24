"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/menu-data";

const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  served: "Served",
  paid: "Paid",
  cancelled: "Cancelled",
};

async function readApiResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    message:
      text.length > 180
        ? "The server returned an unexpected non-JSON response."
        : text || "The server returned an unexpected response.",
  };
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const hasLoadedOnce = useRef(false);
  const previousOrderIds = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);

  function createAudioContext() {
    if (audioContextRef.current) return audioContextRef.current;

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return null;

    audioContextRef.current = new AudioContextClass();
    return audioContextRef.current;
  }

  function playNewOrderSound() {
    try {
      const audioContext = createAudioContext();
      if (!audioContext) return;

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const now = audioContext.currentTime;

      function playTone(
        frequency: number,
        startTime: number,
        duration: number,
        volume = 0.38
      ) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.05);
      }

      playTone(740, now, 0.22, 0.42);
      playTone(980, now + 0.16, 0.25, 0.45);
      playTone(1240, now + 0.34, 0.32, 0.5);

      playTone(980, now + 0.75, 0.2, 0.38);
      playTone(1240, now + 0.9, 0.28, 0.44);

      if ("vibrate" in navigator) {
        navigator.vibrate([180, 80, 180]);
      }
    } catch {
      // Silent fallback.
    }
  }

  function showNewOrderNotification(order: Order) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    new Notification("New AfroLive Order", {
      body: `${order.ref} · Table ${order.tableNumber} · ${formatPrice(
        order.total
      )}`,
    });
  }

  async function enableNotifications() {
    const audioContext = createAudioContext();

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }

    playNewOrderSound();

    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      alert("Notifications and sound alerts are enabled.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Notifications and sound alerts are enabled.");
    } else {
      alert("Sound alert is enabled, but browser notifications were not enabled.");
    }
  }

  const loadOrders = useCallback(
    async (options?: { showRefreshing?: boolean; notify?: boolean }) => {
      const showRefreshing = options?.showRefreshing ?? false;
      const shouldNotify = options?.notify ?? true;

      if (showRefreshing) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch("/api/orders", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/dashboard-login";
          return;
        }

        const data = await readApiResponse(response);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        const nextOrders = data.orders as Order[];
        const nextOrderIds = new Set(nextOrders.map((order) => order.id));

        if (hasLoadedOnce.current && shouldNotify) {
          const newOrders = nextOrders.filter(
            (order) => !previousOrderIds.current.has(order.id)
          );

          newOrders.forEach((order) => {
            playNewOrderSound();
            showNewOrderNotification(order);
          });
        } else {
          hasLoadedOnce.current = true;
        }

        previousOrderIds.current = nextOrderIds;
        setOrders(nextOrders);
        setLoadError("");
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading orders."
        );
      } finally {
        setIsLoading(false);

        if (showRefreshing) {
          setIsRefreshing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadOrders({ notify: false });

    const interval = setInterval(() => {
      loadOrders({ notify: true });
    }, 2000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  const activeOrders = orders.filter((order) => order.status !== "cancelled");

  const pendingOrders = orders.filter(
    (order) => order.status === "new" || order.status === "preparing"
  );

  const servedOrders = orders.filter((order) => order.status === "served");

  const paidOrders = orders.filter((order) => order.status === "paid");

  const cancelledOrders = orders.filter((order) => order.status === "cancelled");

  const expectedTotal = useMemo(() => {
    return activeOrders.reduce((sum, order) => sum + order.total, 0);
  }, [activeOrders]);

  const collectedTotal = useMemo(() => {
    return paidOrders.reduce((sum, order) => sum + order.total, 0);
  }, [paidOrders]);

  const unpaidTotal = useMemo(() => {
    return servedOrders.reduce((sum, order) => sum + order.total, 0);
  }, [servedOrders]);

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    if (updatingOrderId) return;

    const previousOrders = orders;

    const nextOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );

    setOrders(nextOrders);
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        window.location.href = "/dashboard-login";
        return;
      }

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      await loadOrders({ notify: false });
    } catch (error) {
      setOrders(previousOrders);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the order."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function clearAllOrders() {
    const confirmed = window.confirm(
      "Clear all orders? This will delete the orders from Supabase."
    );

    if (!confirmed) return;

    setIsClearing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
      });

      if (response.status === 401) {
        window.location.href = "/dashboard-login";
        return;
      }

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to clear orders");
      }

      setOrders([]);
      previousOrderIds.current = new Set();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while clearing orders."
      );
    } finally {
      setIsClearing(false);
    }
  }

  async function logout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/dashboard-logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/dashboard-login";
    }
  }

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--text-main)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border-soft)] bg-[var(--panel-bg)] px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="font-display text-[28px] leading-none tracking-[1px]">
              afro<span className="text-[var(--gold)]">live</span>
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[3px] text-[var(--gold)]">
              Staff Dashboard
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-green-500">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Live
            </div>

            <button
              type="button"
              onClick={enableNotifications}
              className="rounded-lg border border-[var(--gold)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-[var(--gold)]"
            >
              Enable Notifs
            </button>

            <button
              type="button"
              onClick={() => loadOrders({ showRefreshing: true, notify: false })}
              disabled={isRefreshing}
              className="rounded-lg border border-[var(--border-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={clearAllOrders}
              disabled={isClearing}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </button>

            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="rounded-lg border border-[var(--border-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? "Logging Out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-6">
        <div className="grid gap-4 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-bg)] p-5 md:grid-cols-4">
          <RevenueStat label="Expected" value={formatPrice(expectedTotal)} />
          <RevenueStat label="Collected" value={formatPrice(collectedTotal)} />
          <RevenueStat label="Unpaid Served" value={formatPrice(unpaidTotal)} />
          <RevenueStat label="Orders" value={String(orders.length)} />
        </div>

        {loadError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-500">
            {loadError}
          </div>
        ) : null}

        {isLoading ? (
          <DashboardLoadingState />
        ) : (
          <>
            <section>
              <div className="mb-4 flex items-center gap-3">
                <h1 className="font-display text-[22px] tracking-[2px] text-[var(--gold)]">
                  Incoming Orders
                </h1>

                {pendingOrders.length > 0 ? (
                  <span className="rounded-full bg-[var(--gold)] px-3 py-0.5 text-xs font-bold text-black">
                    {pendingOrders.length}
                  </span>
                ) : null}
              </div>

              {pendingOrders.length === 0 ? (
                <EmptyState text="No active orders yet. Orders will appear here after customers place them." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isUpdating={updatingOrderId === order.id}
                      onStatusChange={updateOrderStatus}
                    />
                  ))}
                </div>
              )}
            </section>

            {servedOrders.length > 0 ? (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-display text-[22px] tracking-[2px] text-[var(--gold)]">
                    Served / Awaiting Payment
                  </h2>

                  <span className="rounded-full bg-[var(--gold)] px-3 py-0.5 text-xs font-bold text-black">
                    {servedOrders.length}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {servedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isUpdating={updatingOrderId === order.id}
                      onStatusChange={updateOrderStatus}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {paidOrders.length > 0 ? (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-display text-[22px] tracking-[2px] text-[var(--text-muted)]">
                    Paid Orders
                  </h2>

                  <span className="rounded-full bg-green-500 px-3 py-0.5 text-xs font-bold text-black">
                    {paidOrders.length}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paidOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isUpdating={updatingOrderId === order.id}
                      onStatusChange={updateOrderStatus}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {cancelledOrders.length > 0 ? (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-display text-[22px] tracking-[2px] text-red-500">
                    Cancelled Orders
                  </h2>

                  <span className="rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold text-black">
                    {cancelledOrders.length}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cancelledOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isUpdating={updatingOrderId === order.id}
                      onStatusChange={updateOrderStatus}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}

function RevenueStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[2px] text-[var(--text-muted)]">
        {label}
      </div>
      <div className="font-display mt-1 text-[32px] leading-none text-[var(--gold)]">
        {value}
      </div>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-bg)] p-5"
        >
          <div className="h-5 w-24 animate-pulse rounded bg-[rgba(244,180,0,0.16)]" />
          <div className="mt-4 h-4 w-40 animate-pulse rounded bg-[var(--border-soft)]" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded bg-[var(--border-soft)]" />
          <div className="mt-8 h-10 w-full animate-pulse rounded bg-[rgba(244,180,0,0.12)]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-bg)] px-6 py-14 text-center text-sm leading-7 text-[var(--text-muted)]">
      {text}
    </div>
  );
}

function OrderCard({
  order,
  isUpdating,
  onStatusChange,
}: {
  order: Order;
  isUpdating: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  const createdAt = new Date(order.createdAt);

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-[var(--surface-bg)] ${
        order.status === "paid"
          ? "border-green-500/30 opacity-70"
          : order.status === "cancelled"
          ? "border-red-500/30 opacity-60"
          : "border-[var(--border-soft)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--border-soft)] bg-[rgba(244,180,0,0.04)] px-4 py-3">
        <div>
          <div className="font-display text-xl tracking-[2px] text-[var(--gold)]">
            {order.ref}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[1px] text-[var(--text-muted)]">
            {createdAt.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="rounded-md bg-[var(--gold)] px-3 py-1 text-xs font-bold text-black">
          Table {order.tableNumber}
        </div>
      </div>

      <div className="px-4 pt-3 text-sm font-semibold">
        {order.customerName}
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        {order.items.map((item) => (
          <div
            key={`${order.id}-${item.id}`}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex-1">{item.name}</span>
            <span className="rounded bg-black/10 px-2 py-0.5 text-[11px] text-[var(--text-muted)] dark:bg-black">
              x{item.qty}
            </span>
            <span className="font-display text-base text-[var(--gold)]">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="mx-4 h-px bg-[var(--border-soft)]" />

      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] uppercase tracking-[2px] text-[var(--text-muted)]">
          Total
        </span>
        <span className="font-display text-[26px] text-[var(--gold)]">
          {formatPrice(order.total)}
        </span>
      </div>

      <div className="px-4 pb-4">
        <div className="mb-3 rounded-lg border border-[var(--border-soft)] px-3 py-2 text-center text-xs uppercase tracking-[1.5px] text-[var(--text-muted)]">
          {isUpdating ? "Updating..." : statusLabels[order.status]}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {order.status === "new" ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, "preparing")}
              className="rounded-lg border border-[var(--gold)] px-3 py-2 text-xs font-semibold uppercase tracking-[1px] text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Preparing
            </button>
          ) : null}

          {order.status === "new" || order.status === "preparing" ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, "served")}
              className="rounded-lg bg-[var(--gold)] px-3 py-2 text-xs font-bold uppercase tracking-[1px] text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Served
            </button>
          ) : null}

          {order.status === "served" ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, "paid")}
              className="rounded-lg bg-green-500 px-3 py-2 text-xs font-bold uppercase tracking-[1px] text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark Paid
            </button>
          ) : null}

          {order.status !== "paid" && order.status !== "cancelled" ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, "cancelled")}
              className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-[1px] text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}