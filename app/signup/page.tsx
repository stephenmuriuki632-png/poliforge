"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // Authentication will be connected later.
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

            <span className="text-xl font-bold tracking-tight">
              PoliForge
            </span>
          </Link>

          <Link
            href="/login"
            className="text-sm text-white/40 transition hover:text-white"
          >
            Sign in →
          </Link>
        </header>

        {/* Signup */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-xl font-black">
                P
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-3 text-white/40">
                Start turning your ideas into reality.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/50 backdrop-blur-xl md:p-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.06]"
                  />
                </div>

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
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.06]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/40 transition hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-white/20 focus:border-lime-400/50 focus:bg-white/[0.06]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/40 transition hover:text-white"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/35">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-lime-400"
                  />

                  <span>
                    I agree to the PoliForge{" "}
                    <button
                      type="button"
                      className="text-white/70 hover:text-lime-300"
                    >
                      Terms
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-white/70 hover:text-lime-300"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {/* Create account */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create account"}
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
                <span className="text-lg font-bold">
                  G
                </span>

                Continue with Google
              </button>
            </div>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-white/35">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-medium text-white transition hover:text-lime-300"
              >
                Sign in
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
}