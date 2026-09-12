"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Wallet = {
  id: string;
  balance: number;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string | null;
  campaign_id: string | null;
  created_at: string;
};

export default function CampaignWalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      let { data: walletData, error: walletError } =
        await supabase
          .from("wallets")
          .select("id, balance")
          .eq("owner_id", user.id)
          .maybeSingle();

      if (walletError) {
        throw new Error(walletError.message);
      }

      if (!walletData) {
        const { data: createdWallet, error: createError } =
          await supabase
            .from("wallets")
            .insert({
              owner_id: user.id,
              balance: 0,
            })
            .select("id, balance")
            .single();

        if (createError) {
          throw new Error(createError.message);
        }

        walletData = createdWallet;
      }

      setWallet(walletData);

      const { data: transactionData, error: transactionError } =
        await supabase
          .from("wallet_transactions")
          .select(
            "id, type, amount, status, description, campaign_id, created_at"
          )
          .eq("wallet_id", walletData.id)
          .order("created_at", { ascending: false });

      if (transactionError) {
        throw new Error(transactionError.message);
      }

      setTransactions(transactionData ?? []);
    } catch (err) {
      console.error("CAMPAIGN WALLET ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load wallet."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatMoney(amount: number) {
    return `KSh ${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  const totalDeposited = transactions
    .filter(
      (transaction) =>
        transaction.type.toLowerCase() === "deposit" &&
        transaction.status.toLowerCase() === "completed"
    )
    .reduce(
      (total, transaction) =>
        total + Math.max(0, Number(transaction.amount) || 0),
      0
    );

  const totalAllocated = transactions
    .filter(
      (transaction) =>
        transaction.type.toLowerCase() === "campaign_allocation" &&
        transaction.status.toLowerCase() === "completed"
    )
    .reduce(
      (total, transaction) =>
        total + Math.max(0, Number(transaction.amount) || 0),
      0
    );

  const totalSpending = transactions
    .filter(
      (transaction) =>
        ["clip_approved", "view_earnings"].includes(
          transaction.type.toLowerCase()
        ) &&
        transaction.status.toLowerCase() === "completed"
    )
    .reduce(
      (total, transaction) =>
        total + Math.max(0, Number(transaction.amount) || 0),
      0
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/campaign/dashboard"
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
            href="/campaign/dashboard"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
              Campaign finances
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Wallet
            </h1>

            <p className="mt-3 max-w-xl text-white/40">
              Manage your campaign funds and track how money is
              allocated and spent.
            </p>
          </div>

          <Link
            href="/campaign/deposit"
            className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/80"
          >
            + Deposit funds
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}

            <button
              onClick={loadWallet}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/10 p-16 text-center text-white/40">
            Loading wallet...
          </div>
        ) : (
          <>
            <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.025] p-7 sm:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Available balance
              </p>

              <p className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {formatMoney(wallet?.balance ?? 0)}
              </p>

              <p className="mt-3 text-sm text-white/30">
                Funds available for campaign allocation.
              </p>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <MoneyCard
                label="Total deposited"
                value={formatMoney(totalDeposited)}
              />

              <MoneyCard
                label="Campaign allocations"
                value={formatMoney(totalAllocated)}
              />

              <MoneyCard
                label="Campaign spending"
                value={formatMoney(totalSpending)}
              />
            </section>

            <section className="mt-10">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                  Wallet activity
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Transaction history
                </h2>
              </div>

              {transactions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xs text-white/40">
                    KES
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    No transactions yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                    Deposits, campaign allocations and campaign
                    spending will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div>
                        <p className="font-medium">
                          {transaction.type}
                        </p>

                        {transaction.description && (
                          <p className="mt-1 text-sm text-white/40">
                            {transaction.description}
                          </p>
                        )}

                        <p className="mt-2 text-[11px] text-white/20">
                          {new Date(
                            transaction.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-lg font-semibold">
                          {formatMoney(transaction.amount)}
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
          </>
        )}
      </section>
    </main>
  );
}

function MoneyCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p className="mt-3 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}
