"use client";

import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    name: "PoliForge Website",
    status: "In progress",
    updated: "Today",
  },
  {
    name: "Mobile App",
    status: "Planning",
    updated: "Yesterday",
  },
  {
    name: "Marketing Campaign",
    status: "Completed",
    updated: "3 days ago",
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#070707] text-white">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#090909] p-5 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Poli<span className="text-white/40">Forge</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40"
          >
            ✕
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          <NavItem label="Overview" active />
          <NavItem label="Projects" />
          <NavItem label="Analytics" />
          <NavItem label="Team" />
        </nav>

        <div className="mt-10 border-t border-white/10 pt-5">
          <p className="px-3 mb-3 text-xs uppercase tracking-widest text-white/20">
            Workspace
          </p>

          <NavItem label="Settings" />
          <NavItem label="Help center" />
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black font-bold">
                S
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Stephen
                </p>
                <p className="truncate text-xs text-white/30">
                  Free workspace
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 sm:px-8">

          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-white/10 px-3 py-2 text-white/60 lg:hidden"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-white/30">
              Workspace
            </p>
            <p className="font-medium">
              Overview
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5 sm:block">
              Notifications
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              S
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-5 sm:p-8 lg:p-10">

          {/* Welcome */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm text-white/30">
                Friday, August 14
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Good morning, Stephen.
              </h1>

              <p className="mt-3 max-w-xl text-white/40">
                Here's what's happening in your PoliForge workspace.
              </p>
            </div>

            <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/85">
              + Create project
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Total projects"
              value="12"
              change="+3 this month"
            />

            <StatCard
              label="Active projects"
              value="4"
              change="2 due this week"
            />

            <StatCard
              label="Completed"
              value="8"
              change="+2 this month"
            />

            <StatCard
              label="Team members"
              value="6"
              change="2 invitations pending"
            />

          </div>

          {/* Main grid */}
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            {/* Projects */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02]">

              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <h2 className="font-semibold">
                    Recent projects
                  </h2>

                  <p className="mt-1 text-sm text-white/30">
                    Your latest workspace activity.
                  </p>
                </div>

                <button className="text-sm text-white/40 hover:text-white">
                  View all →
                </button>
              </div>

              <div className="divide-y divide-white/10">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between gap-4 p-6 transition hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] font-semibold">
                        {project.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-medium">
                          {project.name}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          Updated {project.updated}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.02]">

              <div className="border-b border-white/10 p-6">
                <h2 className="font-semibold">
                  Recent activity
                </h2>

                <p className="mt-1 text-sm text-white/30">
                  Latest actions in your workspace.
                </p>
              </div>

              <div className="p-6 space-y-7">

                <Activity
                  title="Project created"
                  description="Mobile App"
                  time="2 hours ago"
                />

                <Activity
                  title="Design updated"
                  description="PoliForge Website"
                  time="5 hours ago"
                />

                <Activity
                  title="Team member joined"
                  description="Alex joined your workspace"
                  time="Yesterday"
                />

                <Activity
                  title="Project completed"
                  description="Marketing Campaign"
                  time="3 days ago"
                />

              </div>
            </section>

          </div>

          {/* Upgrade banner */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  PoliForge Pro
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Build without limits.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                  Unlock advanced analytics, unlimited projects,
                  larger workspaces and powerful collaboration tools.
                </p>
              </div>

              <button className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/85">
                Explore Pro
              </button>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

function NavItem({
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
          ? "bg-white text-black font-medium"
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-sm text-white/35">
        {label}
      </p>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-white/30">
        {change}
      </p>
    </div>
  );
}

function Activity({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />

      <div className="min-w-0">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-white/35">
          {description}
        </p>

        <p className="mt-1 text-xs text-white/20">
          {time}
        </p>
      </div>
    </div>
  );
}