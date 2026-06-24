// app/qr/page.tsx
"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

export default function QRPage() {
  const [menuUrl, setMenuUrl] = useState("");

  useEffect(() => {
    setMenuUrl(`${window.location.origin}/menu`);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-6 py-8 text-[var(--text-main)]">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-8">
          <h1 className="font-display text-5xl tracking-[2px] text-[var(--gold)]">
            afro<span className="text-[var(--text-main)]">live</span>
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
            Scan to place your order
          </p>
        </div>

        <div className="w-full rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="mx-auto inline-block rounded-2xl bg-white p-5">
            {menuUrl ? <QRCodeCanvas value={menuUrl} size={260} /> : null}
          </div>

          <h2 className="font-display mt-8 text-4xl tracking-[2px] text-[var(--gold)]">
            Drinks Menu
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Scan the QR code, select your drinks, enter your table number, and
            place your order.
          </p>

          <p className="mt-5 break-all text-xs text-[var(--text-muted)]">
            {menuUrl}
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="font-display mt-6 rounded-lg border border-[var(--gold)] px-8 py-3 text-lg tracking-[2px] text-[var(--gold)]"
        >
          Print QR Code
        </button>
      </div>
    </main>
  );
}