"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

type ParentCampaign = {
  id: string;
  name: string;
  status: string;
};

const APPROVAL_REWARD = 100;
const VIEWS_RATE = 100;
const MIN_MAX_EARNINGS = 3000;

export default function NewCampaignPage() {
  const [campaignId, setCampaignId] = useState("");
  const [parentCampaigns, setParentCampaigns] = useState<ParentCampaign[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxEarnings, setMaxEarnings] = useState("3000");
  const [amountPlaced, setAmountPlaced] = useState("3000");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadParentCampaigns() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be signed in.");
      return;
    }

    const { data, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id, name, status")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (campaignsError) {
      console.error("PARENT CAMPAIGNS ERROR:", campaignsError);
      setError(campaignsError.message);
      return;
    }

    setParentCampaigns(data ?? []);

    if (data && data.length > 0) {
      setCampaignId(data[0].id);
    }
  }

  async function createCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!campaignId) {
      setError("Please select a parent campaign.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a clipping campaign name.");
      return;
    }

    const parsedMaxEarnings = Number(maxEarnings);
    const parsedAmountPlaced = Number(amountPlaced);

    if (
      !Number.isFinite(parsedMaxEarnings) ||
      parsedMaxEarnings < MIN_MAX_EARNINGS
    ) {
      setError("Maximum campaign earnings must be at least KSh 3,000.");
      return;
    }

    if (
      !Number.isFinite(parsedAmountPlaced) ||
      parsedAmountPlaced < 0
    ) {
      setError("Amount placed cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You must be signed in to create a campaign.");
        setLoading(false);
        return;
      }

      const { data: createdCampaign, error: insertError } =
        await supabase
          .from("clipping_campaigns")
          .insert({
            campaign_id: campaignId,
            title: name.trim(),
            description: description.trim() || null,
            reward: APPROVAL_REWARD,
            views_rate: VIEWS_RATE,
            max_earnings: parsedMaxEarnings,
            amount_placed: parsedAmountPlaced,
            status,
          })
          .select()
          .single();

      console.log("CLIPPING CAMPAIGN CREATED:", createdCampaign);

      if (insertError) {
        console.error(insertError);
        setError(insertError.message);
        setLoading(false);
        return;
      }

      setSuccess("Campaign created successfully.");

      setName("");
      setDescription("");
      setMaxEarnings("3000");
      setAmountPlaced("3000");
      setStatus("active");

      setTimeout(() => {
        window.location.href = "/campaign/dashboard";
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadParentCampaigns();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/campaign/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">PoliForge</span>
          </Link>

          <Link
            href="/campaign/dashboard"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Campaign workspace
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Create a campaign
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-white/40">
            Create a campaign that clippers can discover and use to produce
            short-form content.
          </p>
        </div>

        <form
          onSubmit={createCampaign}
          className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10"
        >
          <div className="space-y-7">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Parent campaign
              </label>

              {parentCampaigns.length === 0 ? (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
                  No parent campaigns found. Create a campaign first.
                </div>
              ) : (
                <select
                  value={campaignId}
                  onChange={(event) => setCampaignId(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3.5 outline-none focus:border-white/30"
                >
                  {parentCampaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              )}

              <p className="mt-2 text-xs text-white/30">
                Select the main campaign this clipping campaign belongs to.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Campaign name
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                placeholder="e.g. 2026 Social Media Campaign"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 outline-none transition placeholder:text-white/20 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this campaign is about..."
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 outline-none transition placeholder:text-white/20 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Amount placed in campaign
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                  KSh
                </span>

                <input
                  value={amountPlaced}
                  onChange={(event) => setAmountPlaced(event.target.value)}
                  type="number"
                  min="0"
                  step="100"
                  placeholder="10000"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-14 pr-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-white/30">
                The amount you allocate to this clipping campaign. PoliForge
                will show the full amount placed separately from campaign
                earnings.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Maximum campaign earnings
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                  KSh
                </span>

                <input
                  value={maxEarnings}
                  onChange={(event) => setMaxEarnings(event.target.value)}
                  type="number"
                  min="3000"
                  step="100"
                  placeholder="10000"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-14 pr-4 outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-white/30">
                This is the maximum amount PoliForge will allow this clipping
                campaign to earn. The minimum is KSh 100.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold text-white">
                  Clipper payment rules
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  These rates are controlled by PoliForge.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/40">
                    Approved clip reward
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    KSh {APPROVAL_REWARD}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Per approved clip
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/40">
                    Views reward
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    KSh {VIEWS_RATE}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Per 1,000 verified views
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <p className="text-xs leading-5 text-white/50">
                  Example: a campaign with a KSh 10,000 maximum can pay up to
                  KSh 10,000 in total earnings across approved clips and
                  verified views.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Campaign status
              </label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3.5 outline-none focus:border-white/30"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>

              <p className="mt-2 text-xs text-white/30">
                Draft campaigns remain private. Active campaigns can be made
                available to clippers.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-300">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/campaign/dashboard"
                className="rounded-xl border border-white/10 px-6 py-3.5 text-center text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating campaign..." : "Create campaign →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
