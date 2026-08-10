"use client";

import { useEffect, useState } from "react";

const features = [
  {
    number: "01",
    title: "Build faster",
    description:
      "Turn ideas into polished digital products with a workflow designed for speed, clarity and iteration.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Work smarter",
    description:
      "Keep your projects, decisions and workflows organized in one focused workspace.",
    icon: "⌘",
  },
  {
    number: "03",
    title: "Scale with confidence",
    description:
      "A modern foundation designed to grow with your product, users and ambitions.",
    icon: "↗",
  },
];

const stats = [
  ["01", "One powerful workspace"],
  ["02", "Built for modern teams"],
  ["03", "Designed for scale"],
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* NAVIGATION */}
      <nav
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-black/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* LOGO */}
          <button
            onClick={() => scrollTo("home")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white text-black transition-transform duration-300 group-hover:rotate-6">
              <span className="text-lg font-black">P</span>
            </div>

            <span className="text-xl font-bold tracking-tight">
              Poli<span className="text-white/50">Forge</span>
            </span>
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollTo("features")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              Features
            </button>

            <button
              onClick={() => scrollTo("workflow")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              How it works
            </button>

            <button
              onClick={() => scrollTo("about")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              About
            </button>

            <button
              onClick={() => scrollTo("faq")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              FAQ
            </button>
          </div>

          {/* DESKTOP CTA */}
          <button
            onClick={() => scrollTo("start")}
            className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 hover:bg-white/90 md:block"
          >
            Get started
          </button>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-px w-5 bg-white transition ${
                  menuOpen ? "translate-y-1 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-white transition ${
                  menuOpen ? "-rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* MOBILE NAV */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-black/95 px-6 py-6 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-5">
              <button
                onClick={() => scrollTo("features")}
                className="text-left text-white/70"
              >
                Features
              </button>

              <button
                onClick={() => scrollTo("workflow")}
                className="text-left text-white/70"
              >
                How it works
              </button>

              <button
                onClick={() => scrollTo("about")}
                className="text-left text-white/70"
              >
                About
              </button>

              <button
                onClick={() => scrollTo("faq")}
                className="text-left text-white/70"
              >
                FAQ
              </button>

              <button
                onClick={() => scrollTo("start")}
                className="mt-2 rounded-full bg-white px-5 py-3 font-semibold text-black"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden pt-20"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-white/[0.025] blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-white/[0.025] blur-3xl" />

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-5xl">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              <span className="text-xs font-medium tracking-wide text-white/70">
                THE NEXT GENERATION WORKSPACE
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[92px]">
              Forge your
              <br />
              <span className="text-white/40">next big idea.</span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50 sm:text-xl">
              PoliForge gives ambitious creators and teams a powerful,
              focused environment to build, organize and scale what matters.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollTo("start")}
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-black transition duration-300 hover:scale-[1.03]"
              >
                Start building
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button
                onClick={() => scrollTo("features")}
                className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.07]"
              >
                Explore PoliForge
              </button>
            </div>

            {/* Trust */}
            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/35">
              <span>Built for creators</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
              <span>Modern architecture</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
              <span>Ready to scale</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mt-24">
            <div className="absolute inset-x-10 -top-10 h-40 rounded-full bg-white/[0.025] blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] shadow-2xl shadow-black">
              {/* Fake browser top */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>

                <div className="hidden rounded-full border border-white/10 px-5 py-1.5 text-[10px] text-white/30 sm:block">
                  poliforge.app
                </div>

                <div className="h-6 w-6 rounded-full border border-white/10" />
              </div>

              {/* Dashboard */}
              <div className="grid min-h-[350px] grid-cols-1 md:grid-cols-[190px_1fr]">
                <div className="hidden border-r border-white/10 p-5 md:block">
                  <div className="mb-8 h-7 w-24 rounded bg-white/10" />

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className={`h-9 rounded-lg ${
                          item === 1 ? "bg-white/10" : "bg-white/[0.025]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="mb-3 h-3 w-20 rounded bg-white/10" />
                      <div className="h-8 w-48 rounded bg-white/10" />
                    </div>

                    <div className="h-9 w-24 rounded-full bg-white/10" />
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                      >
                        <div className="h-2 w-14 rounded bg-white/10" />
                        <div className="mt-5 h-7 w-20 rounded bg-white/10" />
                        <div className="mt-3 h-2 w-24 rounded bg-white/5" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 h-32 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div className="flex h-full items-end gap-2 p-5">
                      {[30, 45, 35, 60, 52, 78, 68, 90, 75, 100].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t bg-white/10 transition-all duration-500 hover:bg-white/30"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
          {stats.map(([number, text]) => (
            <div
              key={number}
              className="flex items-center gap-5 px-0 py-8 sm:px-8 lg:py-10"
            >
              <span className="text-xs text-white/30">{number}</span>
              <span className="text-sm font-medium text-white/60">
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
                Why PoliForge
              </span>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Everything you need.
                <br />
                <span className="text-white/35">Nothing you don't.</span>
              </h2>

              <p className="mt-6 max-w-md leading-7 text-white/45">
                We believe great products need clarity, not clutter. PoliForge
                is designed around the things that help you move forward.
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="group grid gap-5 py-8 sm:grid-cols-[60px_70px_1fr] sm:items-start"
                >
                  <span className="text-xs text-white/25">
                    {feature.number}
                  </span>

                  <span className="text-2xl text-white/60 transition group-hover:text-white">
                    {feature.icon}
                  </span>

                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>

                    <p className="mt-3 max-w-xl leading-7 text-white/40">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section
        id="workflow"
        className="border-y border-white/10 bg-white/[0.015] py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
              Simple workflow
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              From thought
              <br />
              <span className="text-white/35">to reality.</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              [
                "01",
                "Define",
                "Start with the idea, problem or goal you want to solve.",
              ],
              [
                "02",
                "Forge",
                "Build, refine and turn your concept into something real.",
              ],
              [
                "03",
                "Launch",
                "Move from development to execution with confidence.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="bg-black p-8 transition hover:bg-white/[0.025] sm:p-10"
              >
                <span className="text-xs text-white/25">{number}</span>

                <div className="mt-16">
                  <h3 className="text-2xl font-semibold">{title}</h3>

                  <p className="mt-4 leading-7 text-white/40">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.035] blur-3xl" />

            <div className="relative max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
                The PoliForge vision
              </span>

              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Build something you're proud to put your name on.
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/45">
                PoliForge is being built around a simple belief: ambitious
                people deserve tools that feel as ambitious as their ideas.
                Less friction. Better focus. More momentum.
              </p>

              <button
                onClick={() => scrollTo("start")}
                className="mt-8 rounded-full bg-white px-6 py-3.5 font-semibold text-black transition hover:scale-105"
              >
                Start building →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-white/10 py-28 sm:py-36"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
              FAQ
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Questions?
            </h2>
          </div>

          <div className="mt-16 divide-y divide-white/10">
            {[
              [
                "What is PoliForge?",
                "PoliForge is a modern digital workspace designed to help creators and teams turn ideas into real products and projects.",
              ],
              [
                "Is PoliForge ready for teams?",
                "Yes. The platform is being designed with scalability, collaboration and modern product workflows in mind.",
              ],
              [
                "Can I use PoliForge on mobile?",
                "Yes. The interface is designed responsively so the experience works across phones, tablets and desktops.",
              ],
              [
                "Is my data secure?",
                "Security is treated as a core part of the platform architecture rather than something added later.",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                  {question}

                  <span className="text-xl text-white/30 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-2xl leading-7 text-white/40">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="px-6 py-10 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-white px-6 py-20 text-black sm:px-12 sm:py-28 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-black/[0.04] blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/40">
              Your next chapter
            </span>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Ready to forge
              <br />
              something great?
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-black/50">
              Start with an idea. Build with purpose. Let PoliForge help you
              turn it into something real.
            </p>

            <button
              onClick={() => scrollTo("home")}
              className="mt-8 rounded-full bg-black px-7 py-4 font-semibold text-white transition hover:scale-105"
            >
              Get started →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-8">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 sm:flex-row">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                <span className="font-black">P</span>
              </div>

              <span className="text-xl font-bold">PoliForge</span>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/30">
              Forge ideas into reality.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/40">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("workflow")}>
              How it works
            </button>
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("faq")}>FAQ</button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 py-7 text-xs text-white/25 sm:flex-row">
          <span>© {new Date().getFullYear()} PoliForge. All rights reserved.</span>
          <span>Built for the future.</span>
        </div>
      </footer>
    </main>
  );
}