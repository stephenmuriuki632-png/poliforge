"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Clip = {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  campaign_id: string | null;
};

const statusStyles: Record<string, string> = {
  pending: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  submitted: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  approved: "border-green-400/20 bg-green-400/10 text-green-300",
  rejected: "border-red-400/20 bg-red-400/10 text-red-300",
  draft: "border-white/10 bg-white/5 text-white/40",
};

export default function MyClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    loadClips();
  }, []);

  async function loadClips(refresh = false) {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.href = "/login";
      return;
    }

    /*
     * This page uses the videos table because your existing
     * videos table contains owner_id, title, description,
     * file_url, status, campaign_id, etc.
     */
    const { data, error: clipsError } = await supabase
      .from("videos")
      .select(
        "id, title, description, file_url, file_name, file_size, status, created_at, updated_at, campaign_id"
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (clipsError) {
      console.error(clipsError);
      setError(clipsError.message);
      setClips([]);
    } else {
      setClips((data || []) as Clip[]);
    }

    setLoading(false);
    setRefreshing(false);
  }

  const filteredClips = useMemo(() => {
    return clips.filter((clip) => {
      const matchesSearch =
        !search ||
        clip.title.toLowerCase().includes(search.toLowerCase()) ||
        (clip.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        clip.status?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [clips, search, filter]);

  const approved = clips.filter(
    (clip) => clip.status?.toLowerCase() === "approved"
  ).length;

  const pending = clips.filter((clip) =>
    ["pending", "submitted"].includes(clip.status?.toLowerCase())
  ).length;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-10">
          <Link
            href="/clipper/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">PoliForge</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/clipper/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/clipper/earnings"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Earnings
            </Link>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              C
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* Heading */}
        <section>
          <Link
            href="/clipper/dashboard"
            className="text-sm text-white/30 transition hover:text-white"
          >
            ← Back to dashboard
          </Link>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/25">
            Clipper workspace
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            My Clips
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Manage your clips and track their current status.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            number={clips.length}
            label="Total clips"
          />

          <StatCard
            number={pending}
            label="Awaiting review"
          />

          <StatCard
            number={approved}
            label="Approved"
          />
        </section>

        {/* Search and filter */}
        <section className="mt-8">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.02] px-4">
              <span className="mr-3 text-white/25">⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your clips..."
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-white/20"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {["all", "pending", "submitted", "approved", "rejected"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`whitespace-nowrap rounded-xl border px-4 py-3 text-sm capitalize transition ${
                      filter === item
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => loadClips(true)}
              disabled={refreshing}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            <p className="font-medium">Could not load clips</p>
            <p className="mt-2 text-red-300/70">{error}</p>
          </div>
        )}

        {/* Clips */}
        <section className="mt-8">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-20 text-center">
              <p className="text-sm text-white/40">
                Loading your clips...
              </p>
            </div>
          ) : filteredClips.length === 0 ? (
            <EmptyState
              hasClips={clips.length > 0}
              clearSearch={() => {
                setSearch("");
                setFilter("all");
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredClips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ClipCard({ clip }: { clip: Clip }) {
  const status = clip.status?.toLowerCase() || "pending";

  const statusClass =
    statusStyles[status] ||
    "border-white/10 bg-white/5 text-white/40";

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.015] transition hover:border-white/20">
      {/* Preview */}
      <div className="flex h-44 items-center justify-center bg-white/[0.025]">
        {clip.file_url ? (
          <video
            src={clip.file_url}
            controls
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              ▶
            </div>

            <p className="mt-3 text-xs text-white/25">
              No preview available
            </p>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 font-semibold">
            {clip.title || clip.file_name || "Untitled clip"}
          </h2>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] capitalize ${statusClass}`}
          >
            {status}
          </span>
        </div>

        {clip.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/30">
            {clip.description}
          </p>
        )}

        <div className="mt-5 space-y-2 text-xs text-white/25">
          <div className="flex justify-between">
            <span>Created</span>
            <span>
              {new Date(clip.created_at).toLocaleDateString()}
            </span>
          </div>

          {clip.file_name && (
            <div className="flex justify-between gap-4">
              <span>File</span>
              <span className="max-w-[180px] truncate">
                {clip.file_name}
              </span>
            </div>
          )}

          {clip.file_size && (
            <div className="flex justify-between">
              <span>Size</span>
              <span>{formatBytes(clip.file_size)}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          {clip.file_url && (
            <a
              href={clip.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-white/80"
            >
              Open clip
            </a>
          )}

          {clip.campaign_id && (
            <Link
              href={`/clipper/campaigns/${clip.campaign_id}`}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Campaign
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function EmptyState({
  hasClips,
  clearSearch,
}: {
  hasClips: boolean;
  clearSearch: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl">
        ✂
      </div>

      <h2 className="mt-6 text-lg font-semibold">
        {hasClips ? "No matching clips" : "You haven't created any clips yet"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
        {hasClips
          ? "Try changing your search or status filter."
          : "Find an active campaign and start creating your first short-form clip."}
      </p>

      <div className="mt-6 flex justify-center gap-3">
        {hasClips && (
          <button
            onClick={clearSearch}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Clear filters
          </button>
        )}

        <Link
          href="/clipper/dashboard"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/80"
        >
          Discover campaigns
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  number,
  label,
}: {
  number: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-5">
      <p className="text-2xl font-semibold">{number}</p>

      <p className="mt-2 text-xs text-white/30">{label}</p>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${
    units[index] || "GB"
  }`;
}
