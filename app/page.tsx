"use client";

import { useEffect, useState } from "react";

const features = [
  {
    number: "01",
    title: "Build",
    description:
      "Turn ideas into structured digital products with a workflow designed for speed and clarity.",
  },
  {
    number: "02",
    title: "Forge",
    description:
      "Shape your project through powerful tools, clean interfaces and an environment built around execution.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Move from development to execution with confidence and a product that feels ready for the real world.",
  },
];

const principles = [
  "Simple by default",
  "Built for momentum",
  "Designed to scale",
  "Made for creators",
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* NAVIGATION */}
      <header
        className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-black/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* LOGO */}
          <button
            onClick={() => scrollTo("home")}
            className="group flex items-center gap-3"
            aria-label="Go home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-xl font-black text-black transition-transform duration-300 group-hover:scale-105">
              P
            </span>

            <span className="text-xl font-semibold tracking-tight">
              Poli<span className="text-white/45">Forge</span>
            </span>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollTo("vision")}
              className="text-sm text-white/55 transition hover:text-white"
            >
              Vision
            </button>

            <button
              onClick={() => scrollTo("process")}
              className="text-sm text-white/55 transition hover:text-white"
            >
              Process
            </button>

            <button
              onClick={() => scrollTo("features")}
              className="text-sm text-white/55 transition hover:text-white"
            >
              Features
            </button>
          </nav>

          {/* DESKTOP CTA */}
          <button
            onClick={() => scrollTo("start")}
            className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85 md:block"
          >
            Get started
          </button>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] md:hidden"
            aria-label="Toggle navigation"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-[2px] w-5 bg-white transition ${
                  menuOpen ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition ${
                  menuOpen ? "-translate-y-[0px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* MOBILE NAV */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-black px-5 py-6 md:hidden">
            <div className="flex flex-col gap-2">
              {[
                ["vision", "Vision"],
                ["process", "Process"],
                ["features", "Features"],
                ["start", "Get started"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="rounded-xl px-4 py-4 text-left text-lg text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden pt-20"
      >
        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute left-1/2 top-[35%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[120px]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/55">
                The future of building
              </span>
            </div>

            <h1 className="text-[clamp(3.8rem,13vw,9.5rem)] font-semibold leading-[0.84] tracking-[-0.07em]">
              Build
              <br />
              <span className="text-white/35">without</span>
              <br />
              limits.
            </h1>

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-lg leading-8 text-white/45 sm:text-xl">
                PoliForge is a modern space for turning ambitious ideas into
                products that are simple, powerful and ready for the world.
              </p>

              <button
                onClick={() => scrollTo("start")}
                className="group flex w-fit items-center gap-4 rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.02]"
              >
                Start building
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <div className="absolute bottom-10 left-5 hidden items-center gap-4 sm:flex lg:left-10">
            <div className="h-10 w-px bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Scroll to explore
            </span>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section
        id="vision"
        className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
                The PoliForge vision
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Build something
                <br />
                <span className="text-white/35">worth remembering.</span>
              </h2>

              <p className="mt-10 max-w-2xl text-lg leading-8 text-white/45">
                Great products do not begin with complexity. They begin with
                an idea, a clear direction and the determination to make it
                real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section
        id="features"
        className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
                One workflow
              </p>

              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                From idea
                <br />
                <span className="text-white/35">to execution.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/35">
              Everything you need to move forward without getting buried in
              unnecessary complexity.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045] sm:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium tracking-[0.25em] text-white/25">
                    {feature.number}
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition group-hover:border-white/30 group-hover:text-white">
                    ↗
                  </span>
                </div>

                <div className="absolute bottom-8 left-7 right-7 sm:left-9 sm:right-9">
                  <h3 className="text-4xl font-semibold tracking-[-0.04em]">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section
        id="process"
        className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
                Why PoliForge
              </p>

              <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
                Less friction.
                <br />
                <span className="text-white/35">More creation.</span>
              </h2>
            </div>

            <div className="divide-y divide-white/10">
              {principles.map((principle, index) => (
                <div
                  key={principle}
                  className="flex items-center justify-between py-6"
                >
                  <span className="text-lg text-white/75">{principle}</span>

                  <span className="text-xs text-white/25">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BIG CTA */}
      <section id="start" className="px-5 pb-8 pt-16 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] px-6 py-24 text-center sm:px-10 sm:py-32">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[100px]" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
              Ready?
            </p>

            <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Your next
              <br />
              <span className="text-white/35">chapter starts here.</span>
            </h2>

            <button
              onClick={() => scrollTo("home")}
              className="mt-10 rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-[1.03]"
            >
              Enter PoliForge →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-black">
              P
            </span>

            <span className="font-medium">PoliForge</span>
          </div>

          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} PoliForge. Built with purpose.
          </p>
        </div>
      </footer>
    </main>
  );
}