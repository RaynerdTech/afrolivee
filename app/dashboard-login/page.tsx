"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dashboard-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-5 text-[var(--text-main)]">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-bg)] p-7">
        <div className="mb-7 text-center">
          <div className="font-display text-5xl leading-none tracking-[2px]">
            afro<span className="text-[var(--gold)]">live</span>
          </div>

          <p className="mt-2 text-[10px] uppercase tracking-[3px] text-[var(--gold)]">
            Staff Dashboard Login
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="password"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[2px] text-[var(--text-muted)]"
          >
            Dashboard Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter staff password"
            className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--field-bg)] px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
          />

          {error ? (
            <p className="mt-3 text-sm text-[var(--error)]">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="font-display mt-6 w-full rounded-lg bg-[var(--gold)] px-5 py-3 text-lg tracking-[2px] text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Checking..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}