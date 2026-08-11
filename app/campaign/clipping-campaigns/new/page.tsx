"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateClippingCampaign() {
  const [platforms, setPlatforms] = useState<string[]>(["TikTok"]);
  const [approvalReward, setApprovalReward] = useState("100");
  const [viewReward, setViewReward] = useState("50");

  const togglePlatform = (platform: string) => {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/campaign/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">PoliForge</span>
          </Link>

          <Link
            href="/campaign/dashboard"
            className="text-sm text-white/40 hover:text-white"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-white/25">
          Clipping campaign
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Create a clipping campaign
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/40">
          Give clippers everything they need to turn your campaign
          footage into short-form content.
        </p>

        <form className="mt-10 space-y-7">
          {/* Campaign name */}
          <div>
            <label className="text-sm font-medium">
              Campaign name
            </label>

            <input
              type="text"
              placeholder="e.g. Mombasa Rally Highlights"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* Objective */}
          <div>
            <label className="text-sm font-medium">
              Campaign objective
            </label>

            <textarea
              rows={4}
              placeholder="What do you want this clipping campaign to achieve?"
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* Source video */}
          <div>
            <label className="text-sm font-medium">
              Source video
            </label>

            <select className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-4 text-sm text-white outline-none focus:border-white/30">
              <option value="">
                Select a campaign video
              </option>
              <option>Campaign video 1</option>
              <option>Campaign video 2</option>
            </select>

            <p className="mt-2 text-xs text-white/20">
              Your uploaded campaign videos will appear here.
            </p>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium">
              Instructions for clippers
            </label>

            <textarea
              rows={6}
              placeholder="Describe the moments, messages, quotes or topics you want clippers to focus on..."
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />

            <p className="mt-2 text-xs text-white/20">
              Clear instructions help creators produce content that
              matches your campaign.
            </p>
          </div>

          {/* Platforms */}
          <div>
            <label className="text-sm font-medium">
              Target platforms
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["TikTok", "Instagram", "YouTube", "Facebook"].map(
                (platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`rounded-xl border px-4 py-3 text-sm transition ${
                      platforms.includes(platform)
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-white/40 hover:border-white/30"
                    }`}
                  >
                    {platform}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                Clips needed
              </label>

              <input
                type="number"
                min="1"
                placeholder="10"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Campaign deadline
              </label>

              <input
                type="date"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
            <p className="text-sm font-medium">
              Clipper rewards
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Clippers can earn an approval reward plus additional
              earnings based on verified views.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Approval reward */}
              <div>
                <label className="text-sm font-medium">
                  Approval reward
                </label>

                <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <span className="px-4 text-sm text-white/30">
                    KES
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={approvalReward}
                    onChange={(e) =>
                      setApprovalReward(e.target.value)
                    }
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-white/20"
                  />
                </div>

                <p className="mt-2 text-xs text-white/20">
                  Paid after the campaign owner approves the clip.
                </p>
              </div>

              {/* View reward */}
              <div>
                <label className="text-sm font-medium">
                  View reward
                </label>

                <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <span className="px-4 text-sm text-white/30">
                    KES
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={viewReward}
                    onChange={(e) =>
                      setViewReward(e.target.value)
                    }
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-white/20"
                  />
                </div>

                <p className="mt-2 text-xs text-white/20">
                  Earned for every 1,000 verified views.
                </p>
              </div>
            </div>

            {/* Example calculation */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-medium text-white/60">
                Example earning
              </p>

              <p className="mt-2 text-xs leading-5 text-white/30">
                A clip approved for KES {approvalReward} that
                reaches 10,000 verified views earns an additional
                KES {Number(viewReward || 0) * 10}.
              </p>

              <p className="mt-2 text-xs font-medium text-white/60">
                Total potential: KES{" "}
                {Number(approvalReward || 0) +
                  Number(viewReward || 0) * 10}
              </p>
            </div>
          </div>

          {/* Notice */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm font-medium">
              Before publishing
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Your campaign will become visible to eligible clippers
              once published. Submitted clips can then be reviewed
              from your campaign dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/campaign/dashboard"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm text-white/50 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="button"
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium hover:bg-white/5"
            >
              Save draft
            </button>

            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/85"
            >
              Publish campaign
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}