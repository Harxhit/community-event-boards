"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/auth/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role !== "Admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "Admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f0e] text-[#f1f1eb]">
        <p className="text-sm text-[#a5b185]">
          Verifying admin access...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}