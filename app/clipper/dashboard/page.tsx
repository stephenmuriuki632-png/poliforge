"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Campaign = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
};

export default function ClipperDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadCampaigns(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const { data, error: campaignsError } = await supabase
      .from("clipping_campaigns")
      .select("id, title, description, status, created_at, campaign_id")
      .order("created_at", { ascending: false });

    console.log("=== ALL CLIPPING CAMPAIGNS ===");
    console.table(data ?? []);
    console.log("CLIPPER CAMPAIGNS RESULT:", {
      data,
      error: campaignsError,
      count: data?.length ?? 0,
    });

    if (campaignsError) {
      console.error("CLIPPER CAMPAIGNS ERROR:", campaignsError);
      setError(campaignsError.message);
      setCampaigns([]);
    } else {
      setCampaigns(data ?? []);
    }

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return campaigns;
    }

    return campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(query) ||
        (campaign.description ?? "").toLowerCase().includes(query)
    );
  }, [campaigns, search]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {menuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#080808] p-5 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 px-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
            P
          </div>

          <span className="text-lg font-semibold">PoliForge</span>
        </Link>

        <div className="mt-10">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
            Clipper
          </p>

          <nav className="mt-3 space-y-1">
            <SideLink href="/clipper/dashboard" label="Discover" active />
            <SideLink href="/clipper/clips" label="My clips" />
            <SideLink href="/clipper/submissions" label="Submissions" />
            <SideLink href="/clipper/earnings" label="Earnings" />
            <SideLink label="Performance" />
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
            Account
          </p>

          <nav className="mt-3 space-y-1">
            <SideLink label="Profile" />
            <SideLink label="Settings" />
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              C
            </div>

            <div>
              <p className="text-sm font-medium">Clipper account</p>
              <p className="text-xs text-white/30">Manage account</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">
        <header className="flex h-20 items-center border-b border-white/10 px-5 sm:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-white/10 px-3 py-2 text-white/60 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-medium">Clipper dashboard</p>
            <p className="mt-0.5 text-xs text-white/25">
              Find campaigns and create content
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white sm:block">
              Notifications
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              C
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          {/* Intro */}
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              Clipper workspace
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Discover campaigns
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Find campaign opportunities, create short-form content and earn
              rewards for approved clips.
            </p>
          </section>

          {/* Search */}
          <section className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.02] px-4">
                <span className="mr-3 text-white/25">⌕</span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search campaigns..."
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-white/20"
                />
              </div>

              <button className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white">
                Filters
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoCard
              title={String(campaigns.length)}
              description="Active campaigns available"
            />

            <InfoCard
              title="—"
              description="Your submitted clips"
            />

            <InfoCard
              title="—"
              description="Your total earnings"
            />
          </section>

          {/* Campaigns */}
          <section className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                  Opportunities
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Available campaigns
                </h2>
              </div>

              <button
                onClick={() => loadCampaigns(true)}
                disabled={refreshing}
                className="hidden text-sm text-white/40 transition hover:text-white disabled:opacity-40 sm:block"
              >
                {refreshing ? "Refreshing..." : "Refresh ↻"}
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />

                <p className="mt-5 text-sm text-white/30">
                  Loading campaigns...
                </p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl">
                  ✂
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {search
                    ? "No campaigns match your search"
                    : "No campaigns available yet"}
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
                  {search
                    ? "Try a different search term."
                    : "New clipping opportunities will appear here when campaigns publish jobs."}
                </p>

                {!search && (
                  <button
                    onClick={() => loadCampaigns(true)}
                    disabled={refreshing}
                    className="mt-6 rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                  >
                    {refreshing ? "Refreshing..." : "Refresh campaigns"}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                  />
                ))}
              </div>
            )}
          </section>

          {/* How it works */}
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.015] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              How clipping works
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              Create clips. Submit. Get rewarded.
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <Step
                number="01"
                title="Discover"
                text="Find a campaign that matches your skills."
              />

              <Step
                number="02"
                title="Create"
                text="Watch the source footage and create your clip."
              />

              <Step
                number="03"
                title="Submit"
                text="Send your finished clip to the campaign."
              />

              <Step
                number="04"
                title="Earn"
                text="Receive the campaign reward when approved."
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SideLink({
  href,
  label,
  active = false,
}: {
  href?: string;
  label: string;
  active?: boolean;
}) {
  const className = `block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
    active
      ? "bg-white text-black"
      : "text-white/40 hover:bg-white/5 hover:text-white"
  }`;

  if (!href) {
    return (
      <button className={className}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function CampaignCard({
  campaign,
}: {
  campaign: Campaign;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.035]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-green-300">
            Active
          </span>

          <h3 className="mt-4 text-xl font-semibold">
            {campaign.title}
          </h3>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
          ✂
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/40">
        {campaign.description || "No campaign description provided."}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
        <p className="text-xs text-white/25">
          Published{" "}
          {new Date(campaign.created_at).toLocaleDateString()}
        </p>

        <Link
          href={`/clipper/campaigns/${campaign.id}`}
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/80"
        >
          View campaign →
        </Link>
      </div>
    </article>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-5">
      <p className="text-2xl font-semibold">{title}</p>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-white/25">{number}</p>

      <h3 className="mt-3 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-white/30">{text}</p>
    </div>
  );
}


