"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

type Role = "campaign" | "clipper";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("campaign");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { error: signupError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    setMessage(
      "Account created successfully. Check your email to confirm your account."
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-black">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="text-xl font-bold tracking-tight">
          PoliForge
        </Link>

        <Link
          href="/login"
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm transition hover:bg-black hover:text-white"
        >
          Sign in
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:items-center lg:py-20">
        <section>
          <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white">
            Join PoliForge
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Turn campaign
            <br />
            videos into
            <br />
            <span className="text-black/30">campaign reach.</span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-black/50">
            PoliForge connects political campaigns with clippers who turn
            long-form campaign videos into short-form content built for social
            media.
          </p>

          <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5">
              <div className="text-2xl">🎥</div>

              <h3 className="mt-5 font-semibold">Campaigns</h3>

              <p className="mt-2 text-sm leading-6 text-black/40">
                Upload videos and get campaign content created by clippers.
              </p>
            </div>

            <div className="rounded-2xl bg-black p-5 text-white">
              <div className="text-2xl">✂️</div>

              <h3 className="mt-5 font-semibold">Clippers</h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Discover campaigns and create short-form clips.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/30">
            Create account
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Choose your role
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/40">
            Tell us how you'll use PoliForge.
          </p>

          {/* ROLE */}
          <div className="mt-8 grid gap-3">
            <button
              type="button"
              onClick={() => setRole("campaign")}
              className={`rounded-2xl border p-5 text-left transition ${
                role === "campaign"
                  ? "border-black bg-black text-white"
                  : "border-black/10 hover:border-black/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Campaign</p>

                  <p
                    className={`mt-1 text-sm ${
                      role === "campaign"
                        ? "text-white/50"
                        : "text-black/40"
                    }`}
                  >
                    Politician or campaign team
                  </p>
                </div>

                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    role === "campaign"
                      ? "border-white bg-white text-black"
                      : "border-black/20"
                  }`}
                >
                  {role === "campaign" && "✓"}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("clipper")}
              className={`rounded-2xl border p-5 text-left transition ${
                role === "clipper"
                  ? "border-black bg-black text-white"
                  : "border-black/10 hover:border-black/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Clipper</p>

                  <p
                    className={`mt-1 text-sm ${
                      role === "clipper"
                        ? "text-white/50"
                        : "text-black/40"
                    }`}
                  >
                    Video editor or content creator
                  </p>
                </div>

                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    role === "clipper"
                      ? "border-white bg-white text-black"
                      : "border-black/20"
                  }`}
                >
                  {role === "clipper" && "✓"}
                </div>
              </div>
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium">Full name</label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="mt-2 w-full rounded-xl bg-[#f5f5f2] px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-2 w-full rounded-xl bg-[#f5f5f2] px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="mt-2 w-full rounded-xl bg-[#f5f5f2] px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-black/10"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-black/80 disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : `Create ${
                    role === "campaign" ? "campaign" : "clipper"
                  } account`}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-black/30">
            By creating an account, you agree to PoliForge's terms and privacy
            policy.
          </p>

          <p className="mt-5 text-center text-sm text-black/40">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-black hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}



