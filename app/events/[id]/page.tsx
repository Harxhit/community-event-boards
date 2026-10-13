"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Ticket,
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

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchEvent() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`/api/events/${id}`);

        if (!cancelled) {
          setEvent(response.data.event);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            axios.isAxiosError(err)
              ? err.response?.data?.message ??
                  "Unable to load event details."
              : "Unable to load event details.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchEvent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const formattedDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f0e] text-[#a5b185]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#29332d] border-t-[#a5b185]" />
          <p className="mt-4 text-sm">Loading event details...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f0e] px-5 text-[#f1f1eb]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Event unavailable</h1>
          <p className="mt-3 text-sm text-[#929a96]">
            {error || "This event could not be found."}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-[#a5b185] px-5 py-3 text-sm font-medium text-[#111614]"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f0e] px-5 py-8 text-[#f1f1eb] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/feed"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#a5b185] transition hover:text-[#d0d9b5]"
        >
          <ArrowLeft size={17} />
          Back to your feed
        </Link>

        <article className="overflow-hidden rounded-3xl border border-[#29332d] bg-[#111614]">
          <div className="relative h-64 bg-[#1a211d] sm:h-96">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111614] via-transparent to-black/10" />
            <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-[#d8dfc4] backdrop-blur">
              {event.category}
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {event.title}
            </h1>

            <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-[#b0b8b1]">
              {event.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-[#29332d] bg-[#151b17] p-4">
                <CalendarDays
                  size={21}
                  className="mt-1 shrink-0 text-[#a5b185]"
                />
                <div>
                  <p className="text-xs text-[#929a96]">Date and time</p>
                  <p className="mt-2 text-sm leading-6">
                    {formattedDate(event.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#29332d] bg-[#151b17] p-4">
                <MapPin
                  size={21}
                  className="mt-1 shrink-0 text-[#a5b185]"
                />
                <div>
                  <p className="text-xs text-[#929a96]">Location</p>
                  <p className="mt-2 text-sm">{event.city}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-5 border-t border-[#29332d] pt-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-[#929a96]">Entry price</p>
                <p className="mt-1 text-3xl font-semibold text-[#c1cca5]">
                  {event.price === 0
                    ? "Free"
                    : new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(event.price)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#929a96]">
                <Ticket size={19} className="text-[#a5b185]" />
                Community event
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}