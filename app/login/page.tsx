"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#070707] text-white flex">
      <section className="hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between p-12 border-r border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Poli<span className="text-white/40">Forge</span>
        </Link>

        <div>
          <div className="mb-6 h-1 w-16 bg-white rounded-full" />
          <h1 className="text-6xl font-bold leading-[1.05] tracking-tight max-w-xl">
            Build.
            <br />
            Ship.
            <br />
            <span className="text-white/30">Launch.</span>
          </h1>

          <p className="mt-8 text-white/40 max-w-md text-lg leading-8">
            A modern workspace for turning ideas into real products.
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-white/20">
          POLIFORGE / 2026
        </p>
      </section>

      <section className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-14">
            <Link href="/" className="text-2xl font-bold">
              PoliForge
            </Link>
          </div>

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-4">
              Welcome back
            </p>

            <h2 className="text-4xl font-semibold tracking-tight">
              Sign in
            </h2>

            <p className="mt-3 text-white/40">
              Continue where you left off.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Email address
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-transparent border-b border-white/20 py-3 pr-20 outline-none focus:border-white transition placeholder:text-white/20"
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

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-white/40 hover:text-white"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-full font-semibold hover:bg-white/80 transition"
            >
              Enter PoliForge →
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-white/20">OR</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button
            type="button"
            className="w-full border border-white/10 rounded-full py-4 hover:bg-white/5 transition"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-white/30 mt-8">
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