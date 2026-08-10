"use client";

import Link from "next/link";
import { useState } from "react";

export default function UploadCampaignVideo() {
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
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
            ← Back to dashboard
          </Link>
        </div>
      </header>

      {/* Page */}
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/25">
            Campaign content
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Upload campaign video
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Upload a speech, interview, rally, press appearance or other
            campaign footage that you want clippers to turn into short-form
            content.
          </p>
        </div>

        <form className="mt-10 space-y-7">
          {/* Video title */}
          <div>
            <label className="text-sm font-medium">
              Video title
            </label>

            <input
              type="text"
              placeholder="e.g. Town Hall Speech — Mombasa"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Tell clippers what this video contains..."
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm font-medium">
              Campaign video
            </label>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`mt-3 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 text-center transition ${
                dragging
                  ? "border-white/50 bg-white/10"
                  : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
              }`}
            >
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
                    Video selected successfully
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-5 text-sm font-medium">
                    Drop your video here
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    or tap to choose a video from your device
                  </p>

                  <p className="mt-4 text-[11px] text-white/20">
                    MP4, MOV or WebM
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium">
              Clipper instructions
            </label>

            <textarea
              rows={5}
              placeholder="What should clippers look for? For example: strong statements, memorable quotes, policy moments..."
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
            />

            <p className="mt-2 text-xs text-white/20">
              These instructions help clippers understand what kind of
              moments you're looking for.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/campaign/dashboard"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              Upload video
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}