"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/auth/AuthContext";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0f0e]">
                <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#a5b185]/20 border-t-[#a5b185]" />

                    <div className="grid grid-cols-2 gap-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#a5b185]" />
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#a5b185]/60" />
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#a5b185]/60" />
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#a5b185]" />
                    </div>
                </div>

                <p className="mt-6 text-sm font-medium tracking-wide text-[#f1f1eb]">
                    Gather
                </p>

                <p className="mt-2 text-sm text-[#929a96]">
                    Preparing your experience...
                </p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}