"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  UsersRound,
  Music2,
  Laptop,
  Utensils,
  Trophy,
  Baby,
  Compass,
  MapPin,
  Sparkles,
  Heart,
} from "lucide-react";
import HomeNavigation from "@/src/components/home/HomeNavigation";
import { useAuth } from "@/src/components/auth/AuthContext";

const categories = [
  {
    name: "Music",
    description: "Live performances and music events",
    icon: Music2,
  },
  {
    name: "Workshops",
    description: "Learn something new and build skills",
    icon: Laptop,
  },
  {
    name: "Food",
    description: "Food experiences and local gatherings",
    icon: Utensils,
  },
  {
    name: "Sports",
    description: "Get active and enjoy the game",
    icon: Trophy,
  },
  {
    name: "Kids",
    description: "Experiences for younger explorers",
    icon: Baby,
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your interests",
    description:
      "Tell us what you enjoy, from live music to workshops and sports.",
  },
  {
    number: "02",
    title: "Find your next event",
    description:
      "Explore upcoming experiences by category, city, and your interests.",
  },
  {
    number: "03",
    title: "Show up and connect",
    description:
      "Turn shared interests into real experiences and new connections.",
  },
];

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <div className="grid h-10 w-10 grid-cols-2 gap-1">
        <span className="rounded-tl-xl rounded-br-md bg-[#a5b185]" />
        <span className="rounded-tr-xl rounded-bl-md bg-[#a5b185]" />
        <span className="rounded-bl-xl rounded-tr-md bg-[#a5b185]" />
        <span className="rounded-br-xl rounded-tl-md bg-[#a5b185]" />
      </div>

      <span className="block text-[25px] font-semibold leading-none tracking-tight">
        Gather
      </span>
    </Link>
  );
}
export default function HomePage() {
  const {user , loading} = useAuth()
  const destination = loading ? "#" : user ? "/feed" : "/signup";
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0f0e] text-[#f1f1eb]">
      {/* Navigation */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <Logo />
          <HomeNavigation/>
        </div>
      </header>

      {/* Hero */}
      <section id="about" className="relative">
        <div className="pointer-events-none absolute -right-48 -top-32 h-[500px] w-[500px] rounded-full bg-[#a5b185]/[0.045] blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#a5b185]/20 bg-[#a5b185]/[0.06] px-3.5 py-2">
              <Sparkles size={14} className="text-[#a5b185]" />
              <span className="text-xs font-medium tracking-wide text-[#c0c9a7]">
                EVENTS · PEOPLE · EXPERIENCES
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your interests deserve to happen{" "}
              <span className="text-[#a5b185]">offline.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#a8b0a9] sm:text-lg">
              Discover local events, learn something new, meet people, and
              spend time doing what you enjoy. Your next experience starts
              here.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={destination}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#a5b185] px-5 text-sm font-semibold text-[#11150f] transition hover:bg-[#bac69a]"
              >
                Get started
                <ArrowRight size={17} />
              </Link>

              <Link
                href="#categories"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#454d43] px-5 text-sm font-medium text-[#e5e7df] transition hover:border-[#a5b185]/60 hover:bg-white/[0.03]"
              >
                Explore categories
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/[0.08] pt-7">
              <div className="flex items-center gap-3">
                <CalendarDays size={19} className="text-[#a5b185]" />
                <span className="text-sm text-[#c0c6bd]">
                  Events near you
                </span>
              </div>
              <div className="flex items-center gap-3">
                <UsersRound size={19} className="text-[#a5b185]" />
                <span className="text-sm text-[#c0c6bd]">
                  Shared interests
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={19} className="text-[#a5b185]" />
                <span className="text-sm text-[#c0c6bd]">
                  Local experiences
                </span>
              </div>
            </div>
          </div>

          {/* Product introduction panel, without stock imagery */}
          <div className="relative">
            <div className="rounded-2xl border border-[#353d34] bg-[#111614] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a5b185]">
                    Make time for what matters
                  </p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                    Find your kind of thing.
                  </h2>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#a5b185]/20 bg-[#a5b185]/[0.08]">
                  <Compass size={22} className="text-[#a5b185]" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[#a8b0a9]">
                A music night, a weekend workshop, a game with friends, or
                something completely new. Start with what interests you.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  { icon: Music2, label: "Discover new experiences" },
                  { icon: Heart, label: "Choose what interests you" },
                  { icon: UsersRound, label: "Connect through shared interests" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3.5"
                    >
                      <Icon
                        size={18}
                        className="shrink-0 text-[#a5b185]"
                      />
                      <span className="text-sm text-[#d5d9d1]">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#bdc99b] transition hover:text-[#e0e8cc]"
              >
                Find your next experience
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="pointer-events-none absolute -bottom-4 -right-3 -z-10 h-28 w-28 rounded-full bg-[#a5b185]/[0.08] blur-3xl" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-y border-white/[0.06] bg-[#0e1311]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a5b185]">
                Start with your interests
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                What are you into?
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#a8b0a9]">
              Explore different kinds of experiences. Choose your interests
              to help shape the events you see.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/signup?category=${encodeURIComponent(category.name === "Workshops" ? "Workshop" : category.name === "Food" ? "Food" : category.name)}`}
                  className="group flex min-h-48 flex-col rounded-xl border border-[#303831] bg-[#111614] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#a5b185]/50 hover:bg-[#151b17]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#a5b185]/20 bg-[#a5b185]/[0.07] transition group-hover:bg-[#a5b185]/[0.13]">
                    <Icon size={21} className="text-[#b8c494]" />
                  </div>

                  <h3 className="mt-6 text-lg font-medium">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#929a93]">
                    {category.description}
                  </p>

                  <div className="mt-auto flex justify-end pt-4">
                    <ArrowRight
                      size={17}
                      className="text-[#8f9a7c] transition group-hover:translate-x-1 group-hover:text-[#c4d0a4]"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-5 text-xs leading-5 text-[#7f887f]">
            You can change your interests after creating your account.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a5b185]">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              From interests to experiences.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#a8b0a9] sm:text-base">
              No complicated setup. Start with what you like and find
              experiences worth making time for.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="border-t border-[#3a4338] pt-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium tracking-widest text-[#a5b185]">
                    {step.number}
                  </span>
                  {index === 0 && (
                    <Heart size={18} className="text-[#7e8b69]" />
                  )}
                  {index === 1 && (
                    <Compass size={18} className="text-[#7e8b69]" />
                  )}
                  {index === 2 && (
                    <UsersRound size={18} className="text-[#7e8b69]" />
                  )}
                </div>

                <h3 className="mt-6 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#9da59d]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090c0b]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-7 text-[#929a93]">
                Discover experiences, explore your interests, and connect
                with the world around you.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#f1f1eb]">
                Explore
              </h3>
              <div className="mt-4 flex flex-col items-start gap-3">
                <Link
                  href="#categories"
                  className="text-sm text-[#929a93] transition hover:text-[#c4d0a4]"
                >
                  Categories
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm text-[#929a93] transition hover:text-[#c4d0a4]"
                >
                  How it works
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#f1f1eb]">
                Your account
              </h3>
              <div className="mt-4 flex flex-col items-start gap-3">
                <Link
                  href="/signup"
                  className="text-sm text-[#929a93] transition hover:text-[#c4d0a4]"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-[#929a93] transition hover:text-[#c4d0a4]"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#f1f1eb]">
                About Gather
              </h3>
              <div className="mt-4 flex flex-col items-start gap-3">
                <Link
                  href="#about"
                  className="text-sm text-[#929a93] transition hover:text-[#c4d0a4]"
                >
                  Our purpose
                </Link>
                <Link
                  href="#about"
                  className="text-sm text-[#929a93] transition hover:text-[#c4d0a4]"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#7f887f]">
              © 2026 Gather. All rights reserved.
            </p>
            <p className="text-xs text-[#7f887f]">
              Made for real-world connections.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
