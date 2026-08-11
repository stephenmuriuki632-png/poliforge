"use client";

import Link from "next/link";
import { useState } from "react";

export default function SubmitClipPage() {
  const [fileName, setFileName] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [confirmed, setConfirmed] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/clipper/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>
            <span className="font-semibold">PoliForge</span>
          </Link>

          <Link
            href="/clipper/campaigns/test-campaign"
            className="text-sm text-white/40 hover:text-white"
          >
            ← Back to campaign
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-white/25">
          Clip submission
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Submit your clip
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/40">
          Submit your finished video for review. Approved clips can
          earn an approval reward and additional rewards from verified
          views.
        </p>

        {/* Campaign reward summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-xs text-white/30">
              Approval reward
            </p>

            <p className="mt-2 text-2xl font-semibold">
              KES 100
            </p>

            <p className="mt-1 text-xs text-white/20">
              After approval
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-xs text-white/30">
              View reward
            </p>

            <p className="mt-2 text-2xl font-semibold">
              KES 50
            </p>

            <p className="mt-1 text-xs text-white/20">
              Per 1,000 verified views
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-7">
          {/* Upload */}
          <div>
            <label className="text-sm font-medium">
              Your finished clip
            </label>

            <label className="mt-3 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 text-center transition hover:border-white/30 hover:bg-white/[0.04]">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl text-black">
                ↑
              </div>

              {fileName ? (
                <>
                  <p className="mt-5 text-sm font-medium">
                    {fileName}
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    Video selected
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-5 text-sm font-medium">
                    Upload your finished clip
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    Tap to choose a video from your device
                  </p>

                  <p className="mt-4 text-[11px] text-white/20">
                    MP4, MOV or WebM
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">
              Clip title
            </label>

            <input
              type="text"
              placeholder="e.g. Powerful statement about youth"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="text-sm font-medium">
              Intended platform
            </label>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-4 text-sm outline-none"
            >
              <option>TikTok</option>
              <option>Instagram</option>
              <option>YouTube</option>
              <option>Facebook</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">
              Notes for campaign owner
            </label>

            <textarea
              rows={5}
              placeholder="Tell the campaign owner what moment you selected or anything they should know..."
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* Confirmation */}
          <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-medium">
                I confirm this clip follows the campaign requirements.
              </span>

              <span className="mt-2 block text-xs leading-5 text-white/30">
                I understand that the clip must be reviewed and
                approved before the approval reward is released.
              </span>
            </span>
          </label>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/clipper/campaigns/test-campaign"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm text-white/50 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={!confirmed || !fileName}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Submit for review
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}