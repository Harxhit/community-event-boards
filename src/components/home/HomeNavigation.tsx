"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Compass, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/src/components/auth/AuthContext";

export default function HomeNavigation() {
  const { user, loading } = useAuth();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <nav className="hidden items-center gap-8 md:flex">
        <Link href="/#about" className="text-sm text-[#a8b0a9] hover:text-[#f1f1eb]">
          About
        </Link>
        <Link href="/#categories" className="text-sm text-[#a8b0a9] hover:text-[#f1f1eb]">
          Categories
        </Link>
        <Link href="/events" className="text-sm text-[#a8b0a9] hover:text-[#f1f1eb]">
          Browse events
        </Link>
      </nav>

      {loading ? (
        <div className="h-9 w-24 animate-pulse rounded-lg bg-white/[0.05]" />
      ) : user ? (
        <>
          <Link
            href="/feed"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#d9ddd5] hover:bg-white/[0.05] sm:inline-flex"
          >
            <Compass size={16} /> My Feed
          </Link>

          <Link
            href="/preferences"
            className="inline-flex items-center gap-2 rounded-lg bg-[#a5b185] px-3 py-2.5 text-sm font-medium text-[#11150f] hover:bg-[#bac69a] sm:px-4"
          >
            <Heart size={16} /> Edit interests
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm text-[#d9ddd5] hover:bg-white/[0.05] sm:px-4"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-[#a5b185] px-3 py-2.5 text-sm font-medium text-[#11150f] hover:bg-[#bac69a] sm:px-4"
          >
            Sign up <ArrowRight size={15} />
          </Link>
        </>
      )}
    </div>
  );
}