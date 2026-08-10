"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#080808] p-5 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
            P
          </div>

          <span className="text-lg font-semibold tracking-tight">
            PoliForge
          </span>
        </Link>

        {/* Navigation */}
        <nav className="mt-10 space-y-1">
          <DashboardLink label="Overview" active />
          <DashboardLink label="Projects" />
          <DashboardLink label="Team" />
          <DashboardLink label="Activity" />
        </nav>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
            Workspace
          </p>

          <DashboardLink label="Settings" />
          <DashboardLink label="Help" />
        </div>

        {/* Bottom account area */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              U
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                Your account
              </p>
              <p className="truncate text-xs text-white/30">
                Account settings
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
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-white/10 px-3 py-2 text-white/60 transition hover:bg-white/5 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-medium">Overview</p>
            <p className="mt-0.5 text-xs text-white/25">
              Workspace dashboard
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Notifications
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              U
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          {/* Welcome */}
          <section>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25">
              Workspace
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Overview
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage your projects, collaborate with your team, and
              keep everything organized in one place.
            </p>
          </section>

          {/* Main empty state */}
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.015]">
            <div className="flex min-h-[430px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl">
                +
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                Create your first project
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/35">
                Start a new project and bring your ideas, tasks,
                and team together inside PoliForge.
              </p>

              <Link
                href="/dashboard/projects/new"
                className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Create project
              </Link>
            </div>
          </section>

          {/* Quick actions */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              title="Projects"
              description="View and manage your projects."
            />

            <QuickAction
              title="Team"
              description="Invite people and manage collaboration."
            />

            <QuickAction
              title="Activity"
              description="See what's happening in your workspace."
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function DashboardLink({
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

function QuickAction({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button className="group rounded-2xl border border-white/10 bg-white/[0.015] p-5 text-left transition hover:border-white/20 hover:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {title}
        </h3>

        <span className="text-white/20 transition group-hover:text-white">
          →
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {description}
      </p>
    </button>
  );
}