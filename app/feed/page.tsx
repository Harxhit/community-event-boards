"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  RefreshCw,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  category: "Music" | "Workshop" | "Food" | "Sports" | "Kids";
  city: string;
  date: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface FeedResponse {
  success: boolean;
  message: string;
  events: Event[];
  currentPage: number;
  totalPages: number;
  totalEvents: number;
}

const PAGE_SIZE = 10;

export default function FeedPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<string>>(
    new Set()
  );
  const [bookmarking, setBookmarking] = useState<Set<string>>(new Set());

  async function fetchFeed(page: number = currentPage) {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<FeedResponse>("/api/feed", {
        params: {
          page,
          limit: PAGE_SIZE,
        },
      });

      const data = response.data;

      setEvents(data.events ?? []);
      setMessage(data.message ?? "");
      setCurrentPage(data.currentPage ?? page);
      setTotalPages(data.totalPages ?? 0);
      setTotalEvents(data.totalEvents ?? 0);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to load your feed."
          : "Unable to load your feed."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchFeed(1);
  }, []);

  async function handleBookmark(eventId: string) {
    if (bookmarking.has(eventId) || bookmarkedEvents.has(eventId)) return;

    setBookmarking((prev) => new Set(prev).add(eventId));
    setError("");

    try {
      await axios.post(`/api/events/${eventId}/bookmark`);

      setBookmarkedEvents((prev) => new Set(prev).add(eventId));
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to bookmark event."
          : "Unable to bookmark event."
      );
    } finally {
      setBookmarking((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    }
  }

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  return (
    <main className="min-h-screen bg-[#0b0f0e] px-5 py-8 text-[#f1f1eb] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              aria-label="Gather homepage"
              className="mb-6 inline-flex items-center gap-3 transition hover:opacity-80"
            >
              <div className="grid h-9 w-9 grid-cols-2 gap-1">
                <span className="rounded-tl-xl rounded-br-md bg-[#A5B185]" />
                <span className="rounded-tr-xl rounded-bl-md bg-[#A5B185]" />
                <span className="rounded-bl-xl rounded-tr-md bg-[#A5B185]" />
                <span className="rounded-br-xl rounded-tl-md bg-[#A5B185]" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                Gather
              </span>
            </Link>

            <p className="mb-2 text-sm tracking-widest text-[#a5b185]">
              CURATED FOR YOU
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your feed
            </h1>

            <p className="mt-3 text-sm text-[#929a96] sm:text-base">
              Discover events based on your interests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchFeed()}
            disabled={loading}
            aria-label="Refresh feed"
            className="rounded-xl border border-[#29332d] p-3 text-[#a5b185] transition hover:bg-[#17201b] disabled:opacity-50"
          >
            <RefreshCw size={18} />
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-900/50 bg-[#171311] p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-[#202923] bg-[#111614]"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-[#29332d] bg-[#111614] px-6 py-16 text-center">
            <h2 className="text-xl font-medium">Nothing here yet</h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#929a96]">
              {message ||
                "There are no upcoming events matching your interests yet."}
            </p>

            <Link
              href="/preferences"
              className="mt-6 inline-flex rounded-xl bg-[#a5b185] px-5 py-3 text-sm font-medium text-[#111614] transition hover:bg-[#bac59a]"
            >
              Edit your interests
            </Link>

            <p className="mt-4 text-sm text-[#929a96]">
              Or{" "}
              <Link href="/" className="text-[#a5b185] underline">
                explore all events
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between text-sm text-[#929a96]">
              <span>
                {totalEvents} {totalEvents === 1 ? "event" : "events"} found
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const isBookmarked = bookmarkedEvents.has(event._id);
                const isBookmarking = bookmarking.has(event._id);

                return (
                  <article
                    key={event._id}
                    className="group relative overflow-hidden rounded-2xl border border-[#202923] bg-[#111614] transition duration-300 hover:-translate-y-1 hover:border-[#59664d]"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#1a211d]">
                      <Link
                        href={`/events/${event._id}`}
                        aria-label={`View ${event.title}`}
                        className="block h-full w-full"
                      >
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-[#d8dfc4] backdrop-blur">
                        {event.category}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void handleBookmark(event._id);
                        }}
                        disabled={isBookmarking || isBookmarked}
                        aria-label={
                          isBookmarked
                            ? "Event bookmarked"
                            : "Bookmark event"
                        }
                        aria-pressed={isBookmarked}
                        title={
                          isBookmarked
                            ? "Bookmarked"
                            : isBookmarking
                              ? "Saving bookmark..."
                              : "Bookmark event"
                        }
                        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black disabled:cursor-default disabled:opacity-80"
                      >
                        <Bookmark
                          size={18}
                          fill={isBookmarked ? "currentColor" : "none"}
                          className={
                            isBookmarked ? "text-[#c1cca5]" : "text-white"
                          }
                        />
                      </button>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="block p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5b185]"
                    >
                      <h2 className="text-lg font-medium transition group-hover:text-[#c1cca5]">
                        {event.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#929a96]">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-[#b4bcb6]">
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

                      <div className="mt-5 border-t border-[#29332d] pt-4">
                        <span className="text-lg font-semibold text-[#c1cca5]">
                          {event.price === 0
                            ? "Free"
                            : new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                              }).format(event.price)}
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            <nav
              aria-label="Feed pagination"
              className="mt-10 flex items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => void fetchFeed(currentPage - 1)}
                disabled={loading || currentPage <= 1}
                className="inline-flex items-center gap-2 rounded-xl border border-[#29332d] px-4 py-3 text-sm text-[#d8dfc4] transition hover:bg-[#17201b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <span className="text-sm text-[#929a96]">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => void fetchFeed(currentPage + 1)}
                disabled={loading || currentPage >= totalPages}
                className="inline-flex items-center gap-2 rounded-xl border border-[#29332d] px-4 py-3 text-sm text-[#d8dfc4] transition hover:bg-[#17201b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </nav>
          </>
        )}
      </div>
    </main>
  );
}