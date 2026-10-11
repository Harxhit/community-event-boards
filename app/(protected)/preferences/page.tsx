"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

import {
    Music2,
    BookOpen,
    Utensils,
    Trophy,
    Baby,
    ArrowRight,
    Check,
} from "lucide-react";

const categories = [
    {
        name: "Music",
        description: "Concerts, gigs & live performances",
        icon: Music2,
    },
    {
        name: "Workshop",
        description: "Learn, create & try something new",
        icon: BookOpen,
    },
    {
        name: "Food",
        description: "Tastings, food festivals & more",
        icon: Utensils,
    },
    {
        name: "Sports",
        description: "Matches, games & outdoor activities",
        icon: Trophy,
    },
    {
        name: "Kids",
        description: "Fun activities for the whole family",
        icon: Baby,
    },
] as const;

export default function PreferencesPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggleCategory = (category: string) => {
        setSelected((current) =>
            current.includes(category)
                ? current.filter((item) => item !== category)
                : [...current, category]
        );
    };

    const handleContinue = async () => {
        if (selected.length === 0) {
            setError("Choose at least one category to continue.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await axios.patch("/api/users/me/preferences", {
                preferences: selected,
            });

            router.push("/feed");
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? "Could not save your preferences."
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[#0D1110] px-5 py-12 text-[#F1F1EB] sm:px-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-16 flex items-center gap-3">
                        <div className="grid h-9 w-9 grid-cols-2 gap-1">
                            <span className="rounded-tl-xl rounded-br-md bg-[#A5B185]" />
                            <span className="rounded-tr-xl rounded-bl-md bg-[#A5B185]" />
                            <span className="rounded-bl-xl rounded-tr-md bg-[#A5B185]" />
                            <span className="rounded-br-xl rounded-tl-md bg-[#A5B185]" />
                        </div>
                        <span className="text-2xl font-semibold tracking-tight">
                            Gather
                        </span>
                    </header>

                    <section className="mx-auto max-w-3xl">
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#A5B185]">
                            Make it yours
                        </p>

                        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                            What do you want to experience?
                        </h1>

                        <p className="mt-5 max-w-xl leading-7 text-[#929A96]">
                            Choose the things you enjoy. We&apos;ll use your interests
                            to help you discover events worth showing up for.
                        </p>

                        <div className="mb-5 mt-10 flex items-center justify-between">
                            <span className="text-sm text-[#929A96]">
                                Select all that interest you
                            </span>
                            <span className="text-sm text-[#A5B185]">
                                {selected.length} selected
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {categories.map(({ name, description, icon: Icon }) => {
                                const isSelected = selected.includes(name);

                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => toggleCategory(name)}
                                        aria-pressed={isSelected}
                                        className={`flex min-h-28 items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
                                            isSelected
                                                ? "border-[#A5B185] bg-[#A5B185]/10"
                                                : "border-[#29312D] bg-[#111614] hover:border-[#596451]"
                                        }`}
                                    >
                                        <span
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                                isSelected
                                                    ? "bg-[#A5B185] text-[#0D1110]"
                                                    : "bg-[#202823] text-[#A5B185]"
                                            }`}
                                        >
                                            <Icon size={22} />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block font-medium">
                                                {name}
                                            </span>
                                            <span className="mt-1 block text-sm leading-5 text-[#929A96]">
                                                {description}
                                            </span>
                                        </span>

                                        <span
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                isSelected
                                                    ? "border-[#A5B185] bg-[#A5B185] text-[#0D1110]"
                                                    : "border-[#596451]"
                                            }`}
                                        >
                                            {isSelected && <Check size={13} />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {error && (
                            <p role="alert" className="mt-5 text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-[#929A96]">
                                You can update your interests later.
                            </p>

                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={loading || selected.length === 0}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#A5B185] px-6 font-semibold text-[#0D1110] transition hover:bg-[#B7C39A] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Saving preferences..." : "Continue"}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </ProtectedRoute>
    );
}