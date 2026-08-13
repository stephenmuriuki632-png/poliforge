"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  campaign: string;
  clipId: string;
  clipTitle: string;
  status: string;
  createdAt: string;
};

type Wallet = {
  balance: number;
  transactions: Transaction[];
};

const CLIPPER_NAME = "Current Clipper";

export default function ClipperEarningsPage() {
  const [wallet, setWallet] = useState<Wallet>({
    balance: 0,
    transactions: [],
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("poliforge_wallets");

      if (saved) {
        const wallets = JSON.parse(saved);

        if (wallets[CLIPPER_NAME]) {
          setWallet(wallets[CLIPPER_NAME]);
        }
      }
    } catch {
      setWallet({
        balance: 0,
        transactions: [],
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/clipper/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">
              PoliForge
            </span>
          </Link>

          <Link
            href="/clipper/dashboard"
            className="text-sm text-white/40 hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-white/25">
          Clipper wallet
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Earnings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          Track rewards earned from approved campaign clips and
          other verified activity.
        </p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <p className="text-xs text-white/30">
            Available balance
          </p>

          <p className="mt-3 text-4xl font-semibold tracking-tight">
            KES {wallet.balance.toLocaleString()}
          </p>

          <p className="mt-3 text-xs text-white/25">
            Approval rewards are credited after campaign approval.
          </p>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Transactions
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Reward history
              </h2>
            </div>
          </div>

          {wallet.transactions.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                KES
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No earnings yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                Your approval rewards will appear here when your
                submitted clips are approved.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.02]">
              {wallet.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.type}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {transaction.clipTitle}
                    </p>

                    <p className="mt-2 text-[11px] text-white/20">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold">
                      + KES {transaction.amount.toLocaleString()}
                    </p>

                    <span className="mt-1 inline-block rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/40">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
