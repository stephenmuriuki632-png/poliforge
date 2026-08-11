"use client";

import Link from "next/link";
import { useState } from "react";

export default function ClipperDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link href="/" className="flex items-center gap-3 px-2">
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
            <SideLink label="Discover" active />
            <SideLink label="My clips" />
            <SideLink label="Submissions" />
            <SideLink label="Earnings" />
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
              Find campaign opportunities, turn campaign footage into
              short-form content and earn rewards for approved clips.
            </p>
          </section>

          {/* Search */}
          <section className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.02] px-4">
                <span className="mr-3 text-white/25">⌕</span>

                <input
                  type="search"
                  placeholder="Search campaigns..."
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-white/20"
                />
              </div>

              <button className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white">
                Filters
              </button>
            </div>
          </section>

          {/* Quick stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoCard
              title="Available campaigns"
              description="Campaigns you can apply to"
            />

            <InfoCard
              title="Your submissions"
              description="Clips you've submitted"
            />

            <InfoCard
              title="Your earnings"
              description="Rewards from approved clips"
            />
          </section>

          {/* Discover area */}
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

              <button className="hidden text-sm text-white/40 hover:text-white sm:block">
                View all →
              </button>
            </div>

            {/* Empty state */}
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl">
                ✂
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                No campaigns available yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
                New clipping opportunities will appear here when
                campaigns publish jobs for creators.
              </p>

              <button className="mt-6 rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 hover:bg-white/5 hover:text-white">
                Refresh campaigns
              </button>
            </div>
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

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-5">
      <p className="text-sm font-medium">{title}</p>

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