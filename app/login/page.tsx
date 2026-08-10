"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    // Authentication will be connected here later.
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/[0.06] blur-[140px]" />

      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 md:px-10">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-black">
              P
            </div>

            <span className="text-xl font-bold">
              PoliForge
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm text-white/40 transition hover:text-white"
          >
            Back home →
          </Link>

        </header>

        {/* Login */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-10 text-center">

              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-xl font-black">
                P
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-3 text-white/40">
                Sign in to continue building with PoliForge.
              </p>

            </div>

            {/* Card */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/50 backdrop-blur-xl md:p-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-white/70"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-lime-300/80 transition hover:text-lime-300"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.06]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/40 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>

                {/* Remember */}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/40">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-lime-400"
                  />

                  Remember me

                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-white/25">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* Google */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-3.5 font-medium transition hover:bg-white/[0.07]"
              >
                <span className="text-lg font-bold">G</span>
                Continue with Google
              </button>

            </div>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-white/35">

              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-medium text-white transition hover:text-lime-300"
              >
                Create one
              </Link>

            </p>

          </div>

        </div>

        {/* Footer */}
        <footer className="px-6 py-6 text-center text-xs text-white/20">
          © {new Date().getFullYear()} PoliForge. All rights reserved.
        </footer>

      </div>

    </main>
  );
