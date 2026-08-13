"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ClipStatus = "Pending" | "Approved" | "Rejected";

type Clip = {
  id: string;
  campaignId: string;
  clipper: string;
  title: string;
  platform: string;
  submitted: string;
  views: number;
  status: ClipStatus;
  fileName: string;
  notes: string;
};

const sampleClips: Clip[] = [
  {
    id: "sample-1",
    campaignId: "test-campaign",
    clipper: "Brian K.",
    title: "Powerful message to young voters",
    platform: "TikTok",
    submitted: "Today, 09:42",
    views: 12400,
    status: "Pending",
    fileName: "youth-message.mp4",
    notes: "",
  },
  {
    id: "sample-2",
    campaignId: "test-campaign",
    clipper: "Amina M.",
    title: "Education policy statement",
    platform: "Instagram",
    submitted: "Today, 08:17",
    views: 8700,
    status: "Pending",
    fileName: "education.mp4",
    notes: "",
  },
];

export default function ReviewSubmissionsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("poliforge_submissions");

      if (saved) {
        const submissions: Clip[] = JSON.parse(saved);

        setClips(
          submissions.filter(
            (submission) =>
              submission.campaignId === "test-campaign"
          )
        );
      } else {
        setClips(sampleClips);
      }
    } catch {
      setClips(sampleClips);
    }

    setLoaded(true);
  }, []);

  const updateStatus = (
    id: string,
    status: ClipStatus
  ) => {
    const currentClip = clips.find((clip) => clip.id === id);

    if (!currentClip) return;

    const updated = clips.map((clip) =>
      clip.id === id
        ? { ...clip, status }
        : clip
    );

    setClips(updated);
    setSelectedClip(null);

    const saved = localStorage.getItem(
      "poliforge_submissions"
    );

    if (saved) {
      const allSubmissions: Clip[] = JSON.parse(saved);

      const updatedAll = allSubmissions.map(
        (submission) =>
          submission.id === id
            ? { ...submission, status }
            : submission
      );

      localStorage.setItem(
        "poliforge_submissions",
        JSON.stringify(updatedAll)
      );
    }

    /*
     * Reward logic
     *
     * Approval reward is released only when a Pending
     * submission is approved.
     *
     * The transaction ID is the submission ID, which
     * prevents the same clip from being paid twice.
     */
    if (
      status === "Approved" &&
      currentClip.status === "Pending"
    ) {
      const walletStorage =
        localStorage.getItem("poliforge_wallets");

      const wallets = walletStorage
        ? JSON.parse(walletStorage)
        : {};

      const clipperName =
        currentClip.clipper || "Current Clipper";

      const existingWallet = wallets[clipperName] || {
        balance: 0,
        transactions: [],
      };

      const alreadyPaid =
        existingWallet.transactions.some(
          (transaction: {
            id: string;
          }) => transaction.id === `approval-${id}`
        );

      if (!alreadyPaid) {
        const reward = 100;

        existingWallet.balance =
          Number(existingWallet.balance || 0) + reward;

        existingWallet.transactions.unshift({
          id: `approval-${id}`,
          type: "Approval reward",
          amount: reward,
          campaign: currentClip.campaignId,
          clipId: currentClip.id,
          clipTitle: currentClip.title,
          status: "Completed",
          createdAt: new Date().toISOString(),
        });

        wallets[clipperName] = existingWallet;

        localStorage.setItem(
          "poliforge_wallets",
          JSON.stringify(wallets)
        );
      }
    }
  };

  const pendingCount = clips.filter(
    (clip) => clip.status === "Pending"
  ).length;

  const approvedCount = clips.filter(
    (clip) => clip.status === "Approved"
  ).length;

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-sm text-white/40">
          Loading submissions...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
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
            className="text-sm text-white/40 hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              Campaign review
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Review submissions
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Review clips submitted by clippers and approve
              the ones that meet your campaign requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <p className="text-xs text-white/30">
              Awaiting review
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {pendingCount}
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-7">
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              Campaign
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Campaign Video Clipping
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Approval reward: KES 100 · View reward:
              KES 50 / 1,000 verified views
            </p>
          </div>

          {clips.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-xl">
                ✓
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No submissions yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                When clippers submit videos to this campaign,
                they will appear here for review.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="p-5 sm:p-7"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black">
                        <span className="text-xs text-white/20">
                          Video
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">
                            {clip.title}
                          </h3>

                          <StatusBadge
                            status={clip.status}
                          />
                        </div>

                        <p className="mt-2 text-xs text-white/40">
                          Submitted by {clip.clipper}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/25">
                          <span>{clip.platform}</span>

                          <span>{clip.submitted}</span>

                          <span>
                            {clip.views.toLocaleString()} views
                          </span>
                        </div>

                        {clip.fileName && (
                          <p className="mt-2 text-xs text-white/20">
                            File: {clip.fileName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedClip(clip)
                        }
                        className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white"
                      >
                        Review
                      </button>

                      {clip.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                clip.id,
                                "Approved"
                              )
                            }
                            className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-white/85"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                clip.id,
                                "Rejected"
                              )
                            }
                            className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/50 hover:bg-white/5 hover:text-white"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Submitted clips"
            value={clips.length.toString()}
          />

          <SummaryCard
            label="Approved"
            value={approvedCount.toString()}
          />

          <SummaryCard
            label="Pending"
            value={pendingCount.toString()}
          />
        </section>
      </div>

      {selectedClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                  Clip review
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {selectedClip.title}
                </h2>

                <p className="mt-2 text-xs text-white/30">
                  Submitted by {selectedClip.clipper}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedClip(null)
                }
                className="text-xl text-white/30 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                  ▶
                </div>

                <p className="mt-3 text-xs text-white/25">
                  Video preview
                </p>

                <p className="mt-2 text-[10px] text-white/15">
                  Real video storage will be connected later
                </p>
              </div>
            </div>

            {selectedClip.notes && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-white/25">
                  Clipper notes
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {selectedClip.notes}
                </p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Info
                label="Platform"
                value={selectedClip.platform}
              />

              <Info
                label="Views"
                value={selectedClip.views.toLocaleString()}
              />

              <Info
                label="Approval"
                value="KES 100"
              />

              <Info
                label="View reward"
                value="KES 50 / 1K"
              />
            </div>

            {selectedClip.status === "Pending" && (
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      selectedClip.id,
                      "Approved"
                    )
                  }
                  className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
                >
                  Approve clip
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      selectedClip.id,
                      "Rejected"
                    )
                  }
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/5"
                >
                  Reject clip
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: ClipStatus;
}) {
  const classes =
    status === "Approved"
      ? "border-white/20 text-white"
      : status === "Rejected"
        ? "border-white/10 text-white/30"
        : "border-white/10 text-white/40";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] ${classes}`}
    >
      {status}
    </span>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs text-white/30">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="text-[10px] text-white/25">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium">
        {value}
      </p>
    </div>
  );
}
