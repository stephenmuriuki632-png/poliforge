"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

type Role = "campaign" | "clipper";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Unable to sign in. Please try again.");
        setLoading(false);
        return;
      }

      // Read the authoritative role from public.profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setError(
          "Your account was signed in, but your profile could not be found."
        );
        setLoading(false);
        return;
      }

      const role = profile.role as Role;

      if (role === "clipper") {
        window.location.href = "/clipper/dashboard";
      } else if (role === "campaign") {
        window.location.href = "/campaign/dashboard";
      } else {
        setError("Your account has an invalid role.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#070707] text-white">
      <section className="hidden min-h-screen w-1/2 flex-col justify-between border-r border-white/10 p-12 lg:flex">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Poli<span className="text-white/40">Forge</span>
        </Link>

        <div>
          <div className="mb-6 h-1 w-16 rounded-full bg-white" />

          <h1 className="max-w-xl text-6xl font-bold leading-[1.05] tracking-tight">
            Build.
            <br />
            Ship.
            <br />
            <span className="text-white/30">Launch.</span>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-8 text-white/40">
            A modern workspace for turning campaign ideas into real reach.
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-white/20">
          POLIFORGE / 2026
        </p>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-14 lg:hidden">
            <Link href="/" className="text-2xl font-bold">
              PoliForge
            </Link>
          </div>

          <div className="mb-10">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">
              Welcome back
            </p>

            <h2 className="text-4xl font-semibold tracking-tight">
              Sign in
            </h2>

            <p className="mt-3 text-white/40">
              Continue where you left off.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full border-b border-white/20 bg-transparent py-3 outline-none transition placeholder:text-white/20 focus:border-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border-b border-white/20 bg-transparent py-3 pr-20 outline-none transition placeholder:text-white/20 focus:border-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-xs text-white/40 hover:text-white"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-white/40 hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white py-4 font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Enter PoliForge →"}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/20">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="mt-8 text-center text-sm text-white/30">
            New to PoliForge?{" "}
            <Link
              href="/signup"
              className="text-white hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
