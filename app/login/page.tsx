"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UsersRound,
} from "lucide-react";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=85",
    alt: "Live music concert",
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=85",
    alt: "Community gathering",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=85",
    alt: "Friends spending time together",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      window.location.href = result.data.role === "Admin" ? "/admin" : "/preferences";
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f0e] text-[#f1f1eb]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-[#89976c]/[0.06] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#394c3e]/[0.12] blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(165,176,133,0.035)_35.1%,transparent_35.3%)]" />
      </div>

      <div className="relative mx-auto max-w-[1800px] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        {/* Navigation */}
        <header className="flex items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="grid h-11 w-11 grid-cols-2 gap-1">
              <span className="rounded-tl-xl rounded-br-md bg-[#a5b185]" />
              <span className="rounded-tr-xl rounded-bl-md bg-[#a5b185]" />
              <span className="rounded-bl-xl rounded-tr-md bg-[#a5b185]" />
              <span className="rounded-br-xl rounded-tl-md bg-[#a5b185]" />
            </div>

            <div>
              <span className="block text-[25px] font-semibold leading-none tracking-tight">
                Gather
              </span>
              <span className="mt-2 block text-[9px] tracking-[0.28em] text-[#a0a59c]">
                EVENTS · PEOPLE · EXPERIENCES
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="hidden items-center gap-3 rounded-full border border-[#a5b185]/70 px-5 py-3 text-sm transition hover:bg-[#a5b185]/10 sm:flex"
          >
            Explore Events
            <ArrowRight size={17} className="text-[#b9c596]" />
          </Link>
        </header>

        {/* Main layout */}
        <section className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-10">
          {/* Left: Brand and event imagery */}
          <div className="relative hidden min-w-0 flex-col justify-center lg:flex">
            <div className="absolute right-0 top-0 hidden h-[530px] w-[56%] overflow-hidden rounded-tl-[180px] rounded-br-[100px] md:block lg:right-[-2%] lg:top-[-50px] lg:h-[590px]">
              <img
                src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=90"
                alt="People enjoying a live event"
                className="h-full w-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f0e] via-[#0b0f0e]/20 to-[#0b0f0e]/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0e] via-transparent to-[#0b0f0e]/20" />
            </div>

            <div className="relative z-10 max-w-[570px] pt-5 lg:pt-10">
              <p className="mb-6 text-[11px] font-medium tracking-[0.34em] text-[#bdc7a0]">
                REAL EVENTS. REAL PEOPLE.
              </p>

              <h1 className="text-[clamp(3.8rem,8vw,7rem)] font-normal leading-[0.89] tracking-[-0.075em]">
                Belong
                <br />
                Beyond
                <br />
                <span className="text-[#a5b185]">Screens.</span>
              </h1>

              <p className="mt-7 max-w-[460px] text-base leading-7 text-[#b9beb7] sm:text-lg sm:leading-[1.7]">
                Discover events, meet like-minded people, and turn your
                interests into real-world connections.
              </p>

              {/* Features */}
              <div className="mt-9 grid max-w-[570px] grid-cols-3 gap-3 sm:gap-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#a5b185]/40 text-[#b8c494]">
                    <CalendarDays size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium sm:text-sm">
                      Local Events
                    </p>
                    <p className="mt-1 text-[11px] text-[#929990]">
                      Near you
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#a5b185]/40 text-[#b8c494]">
                    <UsersRound size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium sm:text-sm">
                      Like-minded
                    </p>
                    <p className="mt-1 text-[11px] text-[#929990]">
                      Communities
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#a5b185]/40 text-[#b8c494]">
                    <Compass size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium sm:text-sm">
                      Workshops
                    </p>
                    <p className="mt-1 text-[11px] text-[#929990]">
                      & Meetups
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event collage */}
            <div className="relative z-10 mt-12 max-w-[570px] border-t border-[#444a40]/70 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.28em] text-[#a5b185]">
                    FIND YOUR PEOPLE
                  </p>
                  <p className="mt-1 text-xs text-[#858c82]">
                    From music to ideas
                  </p>
                </div>
                <Sparkles size={17} className="text-[#a5b185]" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.src}
                    className="group relative h-24 overflow-hidden rounded-lg border border-white/[0.08] sm:h-32"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sign-in card */}
          <div className="relative z-20 mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-[#a5b185]/25 via-white/[0.04] to-transparent blur-sm" />

            <div className="relative rounded-[22px] border border-[#777e70]/50 bg-[#111614]/90 px-6 py-9 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="mb-9">
                <p className="text-[10px] tracking-[0.3em] text-[#a5b185]">
                  YOUR NEXT CHAPTER
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-[2.6rem]">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#a8b0a9] sm:text-base">
                  Sign in to continue your event journey.
                </p>
              </div>

              <form className="space-y-7" onSubmit={handleLogin}>
                {/* Email field */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-3 block text-sm font-medium"
                  >
                    Email address
                  </label>

                  <div className="flex h-[58px] items-center gap-3 rounded-xl border border-[#3a413d] bg-[#1a201e]/80 px-4 transition focus-within:border-[#a5b185]/80 focus-within:ring-1 focus-within:ring-[#a5b185]/20">
                    <Mail
                      size={20}
                      className="shrink-0 text-[#a0aaa0]"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#788179]"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#bdc7a0] transition hover:text-[#e0e7cb] sm:text-sm"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="flex h-[58px] items-center gap-3 rounded-xl border border-[#3a413d] bg-[#1a201e]/80 px-4 transition focus-within:border-[#a5b185]/80 focus-within:ring-1 focus-within:ring-[#a5b185]/20">
                    <LockKeyhole
                      size={20}
                      className="shrink-0 text-[#a0aaa0]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#788179]"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 cursor-pointer text-[#9da69d] transition hover:text-[#dce3ce]"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* API and network errors appear here, above the submit button */}
                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-[62px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#a5b185] font-semibold text-[#11150f] transition duration-200 hover:bg-[#bac69a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0d9b5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111614] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}

                  {!loading && (
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="my-9 border-t border-[#343b35]" />

              <p className="text-center text-sm text-[#a8b0a9]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-[#c3ce9f] underline decoration-[#77845e] underline-offset-4 transition hover:text-[#e1e8ca]"
                >
                  Create account
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-[10px] tracking-[0.15em] text-[#606960]">
              FIND YOUR PEOPLE. MAKE IT MEMORABLE.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}