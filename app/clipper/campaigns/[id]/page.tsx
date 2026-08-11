"use client";

import Link from "next/link";

export default function CampaignDetailsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/clipper/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">PoliForge</span>
          </Link>

          <Link
            href="/clipper/dashboard"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Back to campaigns
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Campaign header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                Open for clippers
              </span>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Campaign video clipping
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
                Create engaging short-form clips from the campaign's
                source footage. Focus on memorable statements,
                important messages and moments that work well on
                social media.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:min-w-52">
              <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                Reward
              </p>

              <p className="mt-2 text-3xl font-semibold">
                KES 100
              </p>

              <p className="mt-1 text-xs text-white/30">
                per approved clip
              </p>
            </div>
          </div>
        </section>

        {/* Information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Source video */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Source material
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Campaign source video
              </h2>

              <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                    ▶
                  </div>

                  <p className="mt-4 text-sm text-white/40">
                    Source video preview
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-white/25">
                The actual campaign video will appear here once
                campaign data and video storage are connected.
              </p>
            </section>

            {/* Instructions */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Creative brief
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                What the campaign wants
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-white/50">
                <p>
                  Find strong, memorable moments from the source
                  footage that can stand alone as short-form social
                  content.
                </p>

                <p>
                  Prioritize clear statements, interesting reactions,
                  policy messages, memorable quotes and moments that
                  can capture attention quickly.
                </p>

                <p>
                  Keep the clips concise and make sure the main
                  message is understandable without unnecessary
                  context.
                </p>
              </div>
            </section>

            {/* Requirements */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Requirements
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Requirement
                  title="Format"
                  value="Vertical 9:16"
                />

                <Requirement
                  title="Target platforms"
                  value="TikTok · Instagram · YouTube"
                />

                <Requirement
                  title="Style"
                  value="Short-form social"
                />

                <Requirement
                  title="Clips required"
                  value="10 clips"
                />
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Campaign information */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                Campaign details
              </p>

              <div className="mt-6 space-y-5">
                <Detail label="Status" value="Open" />

                <Detail label="Deadline" value="7 days" />

                <Detail label="Reward" value="KES 100 / clip" />

                <Detail label="Clips needed" value="10" />
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-3xl bg-white p-6 text-black">
              <h2 className="text-lg font-semibold">
                Ready to create?
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Start working on this campaign and submit your first
                clip for review.
              </p>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Start clipping
              </button>
            </section>

            {/* Important note */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-sm font-medium">
                Important
              </p>

              <p className="mt-3 text-xs leading-5 text-white/30">
                A reward is only released after a submitted clip is
                reviewed and approved according to the campaign
                requirements.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-white/30">{label}</span>

      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Requirement({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs text-white/25">{title}</p>

      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}