"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/components/auth/AuthContext";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  Music,
  PartyPopper,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";

interface EventItem {
  _id: string;
  title: string;
  category: "Music" | "Workshop" | "Food" | "Sports" | "Kids";
  city: string;
  date: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface EventsResponse {
  success: boolean;
  message: string;
  events: EventItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type CardTheme = "theme-1" | "theme-2" | "theme-3";
type CardSticker = "music" | "confetti" | "star" | "heart" | "sparkles";

interface CardDesign {
  theme: CardTheme;
  stickers: CardSticker[];
}

const defaultCardDesign: CardDesign = {
  theme: "theme-1",
  stickers: [],
};

const stickerIcons = {
  music: Music,
  confetti: PartyPopper,
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
};

const PAGE_SIZE = 10;

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Gather homepage"
      className="inline-flex items-center gap-3 transition hover:opacity-80"
    >
      <div className="grid h-10 w-10 grid-cols-2 gap-1">
        <span className="rounded-tl-xl rounded-br-md bg-[#a5b185]" />
        <span className="rounded-tr-xl rounded-bl-md bg-[#a5b185]" />
        <span className="rounded-bl-xl rounded-tr-md bg-[#a5b185]" />
        <span className="rounded-br-xl rounded-tl-md bg-[#a5b185]" />
      </div>
      <span className="text-[25px] font-semibold leading-none tracking-tight">
        Gather
      </span>
    </Link>
  );
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<string>>(
    new Set()
  );
  const [bookmarking, setBookmarking] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cardDesigns, setCardDesigns] = useState<
    Record<string, CardDesign>
  >({});
  const [designsLoading, setDesignsLoading] = useState(false);

  // Restore bookmarks when authentication finishes loading.
  // This does not control whether public events are fetched.
  useEffect(() => {
    if (authLoading) return;

    setBookmarkedEvents(
      new Set((user?.bookMarkedEvents ?? []).map(String))
    );
  }, [user, authLoading]);

  async function handleBookmark(eventId: string) {
    if (!user) {
      setError("Log in to save events to your reminders.");
      return;
    }

    if (bookmarking.has(eventId) || bookmarkedEvents.has(eventId)) {
      return;
    }

    setBookmarking((current) => new Set(current).add(eventId));
    setError("");

    try {
      await axios.post(`/api/events/${eventId}/bookmark`);

      setBookmarkedEvents((current) => new Set(current).add(eventId));
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to bookmark event."
          : "Unable to bookmark event."
      );
    } finally {
      setBookmarking((current) => {
        const next = new Set(current);
        next.delete(eventId);
        return next;
      });
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      setLoading(true);
      setDesignsLoading(true);
      setError("");

      try {
        // Public endpoint: no authentication is required to browse events.
        const response = await axios.get<EventsResponse>("/api/events", {
          params: {
            page,
            limit: PAGE_SIZE,
            ...(search.trim() ? { search: search.trim() } : {}),
            ...(city.trim() ? { city: city.trim() } : {}),
            ...(category ? { category } : {}),
          },
          signal: controller.signal,
        });

        const data = response.data;
        const fetchedEvents = data.events ?? [];

        setEvents(fetchedEvents);
        setTotal(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 0);

        if (fetchedEvents.length === 0) {
          setCardDesigns({});
          return;
        }

        try {
          const designResponse = await axios.get<{
            success: boolean;
            designs: {
              eventId: string;
              theme: CardTheme;
              stickers: CardSticker[];
            }[];
          }>("/api/events/card-designs", {
            params: {
              eventIds: fetchedEvents.map((event) => event._id).join(","),
            },
            signal: controller.signal,
          });

          const designs: Record<string, CardDesign> = {};

          for (const design of designResponse.data.designs ?? []) {
            designs[design.eventId] = {
              theme: design.theme ?? "theme-1",
              stickers: design.stickers ?? [],
            };
          }

          if (!controller.signal.aborted) {
            setCardDesigns(designs);
          }
        } catch (err) {
          if (
            axios.isCancel(err) ||
            (axios.isAxiosError(err) && err.code === "ERR_CANCELED")
          ) {
            return;
          }

          if (!controller.signal.aborted) {
            setCardDesigns({});
          }
        }
      } catch (err) {
        if (
          axios.isCancel(err) ||
          (axios.isAxiosError(err) && err.code === "ERR_CANCELED")
        ) {
          return;
        }

        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ??
                "Unable to load events. Please try again."
            : "Unable to load events. Please try again."
        );

        setEvents([]);
        setCardDesigns({});
        setTotal(0);
        setTotalPages(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setDesignsLoading(false);
        }
      }
    }

    void fetchEvents();

    return () => controller.abort();
  }, [page, search, city, category]);

  function updateSearch(value: string) {
    setPage(1);
    setSearch(value);
  }

  function updateCity(value: string) {
    setPage(1);
    setCity(value);
  }

  function updateCategory(value: string) {
    setPage(1);
    setCategory(value);
  }

  function clearFilters() {
    setSearch("");
    setCity("");
    setCategory("");
    setPage(1);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function formatPrice(price: number) {
    if (price === 0) return "Free";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function getThemeClass(theme: CardTheme) {
    switch (theme) {
      case "theme-2":
        return {
          card: "border-[#a5b185] bg-[#e9eadb] text-[#303d30]",
          description: "text-[#56634e]",
          details: "border-[#cbd0b9]",
          price: "text-[#536443]",
        };

      case "theme-3":
        return {
          card: "border-[#a879b5] bg-[#241b2c] text-[#f1f1eb]",
          description: "text-[#c4b8cb]",
          details: "border-[#49384f]",
          price: "text-[#d8b8e6]",
        };

      default:
        return {
          card: "border-[#29332d] bg-[#111614] text-[#f1f1eb]",
          description: "text-[#929a93]",
          details: "border-[#29332d]",
          price: "text-[#c1cca5]",
        };
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f0e] text-[#f1f1eb]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <Logo />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a5b185]">
            Find something to do
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
            Explore events.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#a8b0a9] sm:text-base">
            Discover upcoming experiences in your city. Search by name,
            choose a category, and find your next experience with Gather.
          </p>
        </div>

        <section
          aria-label="Filter events"
          className="mt-8 rounded-2xl border border-[#303831] bg-[#111614] p-4 sm:mt-10 sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search events</span>
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f9a7c]"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search by event name..."
                className="h-12 w-full rounded-lg border border-[#303831] bg-[#0b0f0e] pl-10 pr-4 text-sm text-[#f1f1eb] outline-none placeholder:text-[#737d74] focus:border-[#a5b185]/70"
              />
            </label>

            <label className="block">
              <span className="sr-only">Filter by category</span>
              <select
                value={category}
                onChange={(e) => updateCategory(e.target.value)}
                className="h-12 w-full rounded-lg border border-[#303831] bg-[#0b0f0e] px-3.5 text-sm text-[#d5d9d1] outline-none focus:border-[#a5b185]/70"
              >
                <option value="">All categories</option>
                <option value="Music">Music</option>
                <option value="Workshop">Workshops</option>
                <option value="Food">Food</option>
                <option value="Sports">Sports</option>
                <option value="Kids">Kids</option>
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by city</span>
              <input
                type="text"
                value={city}
                onChange={(e) => updateCity(e.target.value)}
                placeholder="Enter city..."
                className="h-12 w-full rounded-lg border border-[#303831] bg-[#0b0f0e] px-3.5 text-sm text-[#f1f1eb] outline-none placeholder:text-[#737d74] focus:border-[#a5b185]/70"
              />
            </label>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!search && !city && !category}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#454d43] px-4 text-sm text-[#d5d9d1] transition hover:border-[#a5b185]/60 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium sm:text-2xl">
              Upcoming events
            </h2>

            {!loading && (
              <p className="mt-2 text-sm text-[#929a93]">
                {total} {total === 1 ? "event" : "events"} found
                {designsLoading ? " · Loading card designs..." : ""}
              </p>
            )}
          </div>

          {!loading && totalPages > 0 && (
            <span className="text-sm text-[#929a93]">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-900/50 bg-[#171311] p-4 text-sm text-red-300"
          >
            {error}
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              className="ml-2 underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-[#202923] bg-[#111614]"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-[#29332d] bg-[#111614] px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#a5b185]/20 bg-[#a5b185]/[0.07]">
              <Search size={22} className="text-[#a5b185]" />
            </div>

            <h3 className="mt-5 text-xl font-medium">No events found</h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#929a93]">
              Try another search or change your filters to discover more
              upcoming events.
            </p>

            {(search || city || category) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-[#a5b185] px-5 py-3 text-sm font-semibold text-[#11150f] transition hover:bg-[#bac69a]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const design = cardDesigns[event._id] ?? defaultCardDesign;
              const theme = getThemeClass(design.theme);
              const isBookmarked = bookmarkedEvents.has(event._id);
              const isBookmarking = bookmarking.has(event._id);

              return (
                <article
                  key={event._id}
                  className={`group relative overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 ${theme.card}`}
                >
                  <button
                    type="button"
                    onClick={() => void handleBookmark(event._id)}
                    disabled={isBookmarked || isBookmarking}
                    aria-label={
                      isBookmarked ? "Event bookmarked" : "Bookmark event"
                    }
                    aria-pressed={isBookmarked}
                    title={
                      isBookmarked
                        ? "Bookmarked"
                        : isBookmarking
                          ? "Saving bookmark"
                          : "Bookmark event"
                    }
                    className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black disabled:cursor-default disabled:opacity-90"
                  >
                    <Bookmark
                      size={18}
                      fill={isBookmarked ? "currentColor" : "none"}
                      className={
                        isBookmarked ? "text-[#c1cca5]" : "text-white"
                      }
                    />
                  </button>

                  <Link href={`/events/${event._id}`} className="block">
                    <div className="relative h-48 overflow-hidden bg-[#1a211d]">
                      {event.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <CalendarDays
                            size={36}
                            className="text-[#a5b185]"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

                      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-[#d8dfc4] backdrop-blur">
                        {event.category}
                      </span>

                      {design.stickers.length > 0 && (
                        <div className="absolute right-3 top-3 flex gap-1.5">
                          {design.stickers.map((sticker) => {
                            const Icon = stickerIcons[sticker];

                            return (
                              <span
                                key={sticker}
                                className="rounded-full border border-white/15 bg-black/55 p-2 text-white backdrop-blur"
                              >
                                <Icon size={15} />
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-5 pb-0">
                      <h3 className="text-lg font-medium transition group-hover:opacity-80">
                        {event.title}
                      </h3>

                      <p
                        className={`mt-2 line-clamp-2 text-sm leading-6 ${theme.description}`}
                      >
                        {event.description}
                      </p>
                    </div>
                  </Link>

                  <div className="px-5 pb-5">
                    <div className="mt-5 space-y-3 text-sm opacity-80">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-[#a5b185]"
                        />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="shrink-0 text-[#a5b185]"
                        />
                        <span>{event.city}</span>
                      </div>
                    </div>

                    <div
                      className={`mt-5 flex items-center justify-between gap-3 border-t pt-4 ${theme.details}`}
                    >
                      <span className={`text-lg font-semibold ${theme.price}`}>
                        {formatPrice(event.price)}
                      </span>

                      <Link
                        href={`/events/${event._id}/design`}
                        aria-label={`Edit card design for ${event.title}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#a5b185] px-3 py-2 text-xs font-semibold text-[#111614] transition hover:bg-[#bbc59a]"
                      >
                        <Pencil size={14} />
                        {designsLoading && !cardDesigns[event._id]
                          ? "Loading..."
                          : design.stickers.length > 0 ||
                              design.theme !== "theme-1"
                            ? "Edit Design"
                            : "Design Card"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <nav
            aria-label="Event pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-2 rounded-xl border border-[#29332d] px-4 py-3 text-sm text-[#d8dfc4] transition hover:bg-[#17201b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-sm text-[#929a96]">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-[#29332d] px-4 py-3 text-sm text-[#d8dfc4] transition hover:bg-[#17201b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </nav>
        )}

        <div className="mt-12 border-t border-white/[0.06] pt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#a5b185] transition hover:text-[#d8dfc4]"
          >
            <ArrowLeft size={14} className="mr-1 inline" />
            Back to Gather homepage
          </Link>
        </div>
      </div>
    </main>
  );
}