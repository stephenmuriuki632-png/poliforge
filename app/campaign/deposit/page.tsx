"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function DepositPage() {
  const [amount, setAmount] = useState("1000");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start M-Pesa payment.");
      }

      setMessage(
        data.message || "M-Pesa payment request sent to your phone."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start M-Pesa payment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/campaign/wallet"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to wallet
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Deposit funds</h1>

          <p className="mt-2 text-sm text-slate-400">
            Add money to your PoliForge campaign wallet using M-Pesa.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Amount (KSh)
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                M-Pesa phone number
              </label>

              <input
                type="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
              />

              <p className="mt-2 text-xs text-slate-500">
                Use the Safaricom number that will authorize the payment.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Starting payment..." : "Pay with M-Pesa"}
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
