"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Campaign = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type ClippingCampaign = {
  id: string;
  campaign_id: string;
  title: string;
  reward: number;
  views_rate: number;
  max_earnings: number;
  amount_placed: number;
  status: string;
  deadline: string | null;
};

type Submission = {
  id: string;
  clipping_campaign_id: string;
  status: string;
  views: number;
  views_verified: boolean;
};

type Video = {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: string;
  created_at: string;
};

export default function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clippingCampaigns, setClippingCampaigns] = useState<
    ClippingCampaign[]
  >([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Campaign");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
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

      setUserName(
        user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Campaign"
      );

      const { data: campaignData, error: campaignError } =
        await supabase
          .from("campaigns")
          .select(
            "id, name, description, status, created_at, updated_at"
          )
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

      if (campaignError) {
        throw new Error(campaignError.message);
      }

      const campaignRows = (campaignData ?? []) as Campaign[];
      setCampaigns(campaignRows);

      const campaignIds = campaignRows.map(
        (campaign) => campaign.id
      );

      if (campaignIds.length === 0) {
        setClippingCampaigns([]);
        setSubmissions([]);
        setVideos([]);
        return;
      }

      const { data: clippingData, error: clippingError } =
        await supabase
          .from("clipping_campaigns")
          .select(
            "id, campaign_id, title, reward, views_rate, max_earnings, amount_placed, status, deadline"
          )
          .in("campaign_id", campaignIds)
          .order("created_at", {
            ascending: false,
          });

      if (clippingError) {
        throw new Error(clippingError.message);
      }

      const clippingRows =
        (clippingData ?? []) as ClippingCampaign[];

      setClippingCampaigns(clippingRows);

      const clippingIds = clippingRows.map(
        (campaign) => campaign.id
      );

      if (clippingIds.length > 0) {
        const { data: submissionData, error: submissionError } =
          await supabase
            .from("submissions")
            .select(
              "id, clipping_campaign_id, status, views, views_verified"
            )
            .in("clipping_campaign_id", clippingIds);

        if (submissionError) {
          throw new Error(submissionError.message);
        }

        setSubmissions(
          (submissionData ?? []) as Submission[]
        );
      } else {
        setSubmissions([]);
      }

      const { data: videoData, error: videoError } =
        await supabase
          .from("videos")
          .select(
            "id, campaign_id, title, description, file_path, file_url, file_name, file_size, mime_type, status, created_at"
          )
          .eq("owner_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (videoError) {
        throw new Error(videoError.message);
      }

      setVideos((videoData ?? []) as Video[]);
    } catch (err) {
      console.error("CAMPAIGN DASHBOARD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load campaign dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatMoney(amount: number) {
    return `KSh ${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatFileSize(bytes: number | null) {
    if (!bytes) return "Unknown size";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  function openVideo(video: Video) {
    if (!video.file_url) {
      setError("This video does not have a video URL yet.");
      return;
    }

    window.open(video.file_url, "_blank");
  }

  function getCampaignFinancials(
    campaign: ClippingCampaign
  ) {
    const campaignSubmissions = submissions.filter(
      (submission) =>
        submission.clipping_campaign_id === campaign.id
    );

    const approvedSubmissions = campaignSubmissions.filter(
      (submission) =>
        submission.status.toLowerCase() === "approved"
    );

    const approvedClipEarnings =
      approvedSubmissions.length * Number(campaign.reward);

    const verifiedViews = campaignSubmissions
      .filter((submission) => submission.views_verified)
      .reduce(
        (total, submission) =>
          total + Math.max(0, Number(submission.views) || 0),
        0
      );

    const viewEarnings =
      (verifiedViews / 1000) * Number(campaign.views_rate);

    const rawEarned =
      approvedClipEarnings + viewEarnings;

    const maxEarnings = Math.max(
      0,
      Number(campaign.max_earnings) || 0
    );

    const earned = Math.min(rawEarned, maxEarnings);

    const remaining = Math.max(
      0,
      maxEarnings - earned
    );

    const progress =
      maxEarnings > 0
        ? Math.min(100, (earned / maxEarnings) * 100)
        : 0;

    return {
      approvedClips: approvedSubmissions.length,
      verifiedViews,
      approvedClipEarnings,
      viewEarnings,
      earned,
      remaining,
      maxEarnings,
      progress,
    };
  }

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active"
  ).length;

  const draftCampaigns = campaigns.filter(
    (campaign) => campaign.status === "draft"
  ).length;

  const activeClippingCampaigns =
    clippingCampaigns.filter(
      (campaign) => campaign.status === "active"
    ).length;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">
              PoliForge
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/40 sm:block">
              {userName}
            </span>

            <button
              onClick={signOut}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
              Campaign workspace
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Your campaigns
            </h1>

            <p className="mt-3 max-w-xl text-white/40">
              Manage your political campaigns, source videos,
              clipping campaigns and submitted clips.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaign/wallet"
              className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Wallet
            </Link>

            <Link
              href="/campaign/deposit"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              + Deposit funds
            </Link>

            <Link
              href="/campaign/videos/upload"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Upload video
            </Link>

            <Link
              href="/campaign/clipping-campaigns/new"
              className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80"
            >
              + Create clipping campaign
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat
            label="Campaigns"
            value={campaigns.length}
          />

          <Stat
            label="Active"
            value={activeCampaigns}
          />

          <Stat
            label="Drafts"
            value={draftCampaigns}
          />

          <Stat
            label="Clipping campaigns"
            value={clippingCampaigns.length}
          />

          <Stat
            label="Active clipping"
            value={activeClippingCampaigns}
          />
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}

            <button
              onClick={loadDashboard}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Campaigns
              </h2>

              <p className="mt-1 text-sm text-white/30">
                Your campaign workspaces
              </p>
            </div>

            <Link
              href="/campaign/clipping-campaigns/new"
              className="text-sm text-white/40 transition hover:text-white"
            >
              New clipping campaign →
            </Link>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 p-16 text-center text-white/40">
              Loading campaign workspace...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                🎥
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No campaign workspace yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                Create a campaign workspace before uploading
                videos or creating clipping campaigns.
              </p>

              <Link
                href="/campaign/clipping-campaigns/new"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
              >
                Create campaign
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {campaigns.map((campaign) => {
                const campaignVideos =
                  videos.filter(
                    (video) =>
                      video.campaign_id === campaign.id
                  );

                const campaignClippingCampaigns =
                  clippingCampaigns.filter(
                    (item) =>
                      item.campaign_id === campaign.id
                  );

                return (
                  <article
                    key={campaign.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
                  >
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold">
                              {campaign.name}
                            </h3>

                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/60">
                              {campaign.status}
                            </span>
                          </div>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                            {campaign.description ||
                              "No description provided."}
                          </p>

                          <p className="mt-3 text-xs text-white/20">
                            Created{" "}
                            {formatDate(
                              campaign.created_at
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-white/10 pt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              Clipping campaigns
                            </h4>

                            <p className="mt-1 text-xs text-white/30">
                              Campaigns available to clippers
                            </p>
                          </div>

                          <Link
                            href="/campaign/clipping-campaigns/new"
                            className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                          >
                            + Create
                          </Link>
                        </div>

                        {campaignClippingCampaigns.length ===
                        0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
                            <p className="text-sm text-white/35">
                              No clipping campaign created yet.
                            </p>

                            <Link
                              href="/campaign/clipping-campaigns/new"
                              className="mt-4 inline-flex rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black"
                            >
                              Create clipping campaign
                            </Link>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {campaignClippingCampaigns.map(
                              (item) => {
                                const financials =
                                  getCampaignFinancials(item);

                                const budgetReached =
                                  financials.remaining <= 0 &&
                                  financials.maxEarnings > 0;

                                return (
                                  <div
                                    key={item.id}
                                    className="rounded-2xl border border-white/10 bg-black/30 p-5"
                                  >
                                    <div className="flex flex-col gap-5">
                                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                          <div className="flex flex-wrap items-center gap-3">
                                            <h5 className="font-medium">
                                              {item.title}
                                            </h5>

                                            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] capitalize text-white/40">
                                              {budgetReached
                                                ? "Budget Reached"
                                                : item.status}
                                            </span>
                                          </div>

                                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/30">
                                            <span>
                                              Approved clip:{" "}
                                              {formatMoney(
                                                item.reward
                                              )}
                                            </span>

                                            <span>
                                              Views:{" "}
                                              {formatMoney(
                                                item.views_rate
                                              )}{" "}
                                              / 1,000
                                            </span>

                                            {item.deadline && (
                                              <span>
                                                Deadline:{" "}
                                                {formatDate(
                                                  item.deadline
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <Link
                                          href={`/campaign/clipping-campaigns/${item.id}/submissions`}
                                          className="rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-white/80"
                                        >
                                          View submissions →
                                        </Link>
                                      </div>

                                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <MoneyStat
                                          label="Amount placed"
                                          value={formatMoney(
                                            item.amount_placed
                                          )}
                                        />

                                        <MoneyStat
                                          label="Earned"
                                          value={formatMoney(
                                            financials.earned
                                          )}
                                        />

                                        <MoneyStat
                                          label="Remaining"
                                          value={formatMoney(
                                            financials.remaining
                                          )}
                                        />

                                        <MoneyStat
                                          label="Maximum earnings"
                                          value={formatMoney(
                                            financials.maxEarnings
                                          )}
                                        />
                                      </div>

                                      <div>
                                        <div className="mb-2 flex items-center justify-between text-xs">
                                          <span className="text-white/30">
                                            Campaign budget used
                                          </span>

                                          <span className="text-white/60">
                                            {financials.progress.toFixed(
                                              1
                                            )}
                                            %
                                          </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                          <div
                                            className="h-full rounded-full bg-white transition-all"
                                            style={{
                                              width: `${financials.progress}%`,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="grid gap-2 text-xs text-white/30 sm:grid-cols-3">
                                        <span>
                                          Approved clips:{" "}
                                          <strong className="text-white/60">
                                            {
                                              financials.approvedClips
                                            }
                                          </strong>
                                        </span>

                                        <span>
                                          Verified views:{" "}
                                          <strong className="text-white/60">
                                            {financials.verifiedViews.toLocaleString()}
                                          </strong>
                                        </span>

                                        <span>
                                          View earnings:{" "}
                                          <strong className="text-white/60">
                                            {formatMoney(
                                              financials.viewEarnings
                                            )}
                                          </strong>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-8 border-t border-white/10 pt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              Campaign videos
                            </h4>

                            <p className="mt-1 text-xs text-white/30">
                              {campaignVideos.length} video
                              {campaignVideos.length === 1
                                ? ""
                                : "s"}
                            </p>
                          </div>

                          <Link
                            href="/campaign/videos/upload"
                            className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                          >
                            + Upload
                          </Link>
                        </div>

                        {campaignVideos.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
                            <p className="text-sm text-white/35">
                              No videos uploaded to this campaign yet.
                            </p>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {campaignVideos.map(
                              (video) => (
                                <div
                                  key={video.id}
                                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                      <h5 className="truncate font-medium">
                                        {video.title}
                                      </h5>

                                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] capitalize text-white/40">
                                        {video.status}
                                      </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/25">
                                      <span>
                                        {formatFileSize(
                                          video.file_size
                                        )}
                                      </span>

                                      <span>
                                        {formatDate(
                                          video.created_at
                                        )}
                                      </span>

                                      {video.mime_type && (
                                        <span>
                                          {video.mime_type}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() =>
                                      openVideo(video)
                                    }
                                    className="w-full rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:w-auto"
                                  >
                                    Open video →
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-white/40">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function MoneyStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}
