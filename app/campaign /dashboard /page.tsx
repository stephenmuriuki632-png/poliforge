"use client";

import Link from "next/link";
import { useState } from "react";

export default function CampaignDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Mobile overlay */}
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
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
            P
          </div>

          <span className="text-lg font-semibold">
            PoliForge
          </span>
        </Link>

        <div className="mt-10">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
            Campaign
          </p>

          <nav className="mt-3 space-y-1">
            <SideLink label="Overview" active />
            <SideLink label="Videos" />
            <SideLink label="Clipping campaigns" />
            <SideLink label="Submissions" />
            <SideLink label="Clippers" />
            <SideLink label="Analytics" />
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
            Account
          </p>

          <nav className="mt-3 space-y-1">
            <SideLink label="Campaign profile" />
            <SideLink label="Settings" />
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              C
            </div>

            <div>
              <p className="text-sm font-medium">
                Campaign account
              </p>

              <p className="text-xs text-white/30">
                Manage account
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">
        {/* Header */}
        <header className="flex h-20 items-center border-b border-white/10 px-5 sm:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-white/10 px-3 py-2 text-white/60 lg:hidden"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-medium">
              Campaign dashboard
            </p>

            <p className="mt-0.5 text-xs text-white/25">
              Manage your campaign content
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 hover:bg-white/5 sm:block">
              Notifications
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              C
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          {/* Welcome */}
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              Campaign workspace
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your campaign command center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Upload campaign videos, launch clipping campaigns,
              review submissions and coordinate your content
              distribution from one place.
            </p>
          </section>

          {/* Primary actions */}
          <section className="mt-10 grid gap-4 md:grid-cols-2">
            <ActionCard
              icon="↑"
              title="Upload a campaign video"
              description="Give clippers access to a speech, interview, rally or other campaign video."
              button="Upload video"
            />

            <ActionCard
              icon="✂"
              title="Create a clipping campaign"
              description="Tell clippers what content you need, provide instructions and publish the campaign."
              button="Create campaign"
            />
          </section>

          {/* Content overview */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              title="Videos"
              description="Your campaign video library"
              icon="▶"
            />

            <OverviewCard
              title="Active campaigns"
              description="Clipping campaigns currently running"
              icon="◉"
            />

            <OverviewCard
              title="Submissions"
              description="Clips waiting for review"
              icon="✓"
            />

            <OverviewCard
              title="Clippers"
              description="Creators working on your campaigns"
              icon="◎"
            />
          </section>

          {/* Empty states */}
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <EmptySection
              title="Your videos"
              description="Your uploaded campaign videos will appear here."
              action="Upload your first video"
            />

            <EmptySection
              title="Clipping campaigns"
              description="Create a campaign to start receiving clips from creators."
              action="Create a clipping campaign"
            />
          </section>

          {/* How it works */}
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.015] p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                How PoliForge works
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Turn campaign footage into social content
              </h2>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <Step
                number="01"
                title="Upload"
                text="Upload your campaign videos."
              />

              <Step
                number="02"
                title="Launch"
                text="Create a clipping campaign."
              />

              <Step
                number="03"
                title="Clip"
                text="Clippers create short-form content."
              />

              <Step
                number="04"
                title="Review"
                text="Review and approve submissions."
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SideLink({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-white text-black"
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function ActionCard({
  icon,
  title,
  description,
  button,
}: {
  icon: string;
  title: string;
  description: string;
  button: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
        {icon}
      </div>

      <h2 className="mt-6 text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 max-w-lg text-sm leading-6 text-white/35">
        {description}
      </p>

      <button className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85">
        {button}
      </button>
    </div>
  );
}

function OverviewCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-sm text-white/60">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-medium">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

function EmptySection({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-6 sm:p-8">
      <h2 className="font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/30">
        {description}
      </p>

      <div className="mt-8 flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-5 text-center">
        <p className="text-sm text-white/25">
          Nothing here yet
        </p>

        <button className="mt-3 text-sm font-medium text-white hover:underline">
          {action} →
        </button>
      </div>
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
      <p className="text-xs font-medium text-white/25">
        {number}
      </p>

      <h3 className="mt-3 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {text}
      </p>
    </div>
  );
}