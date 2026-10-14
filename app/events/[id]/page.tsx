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
  Pencil,
  Bookmark,
  Save,
  X,
  LoaderCircle,
  Music,
  PartyPopper,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/src/components/auth/AuthContext";

interface Event {
  _id: string;
  title: string;
  category: "Music" | "Workshop" | "Food" | "Sports" | "Kids";
  city: string;
  date: string;
  isActive: boolean;
  price: number;
  description: string;
  imageUrl: string;
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

type EventForm = {
  title: string;
  category: Event["category"];
  city: string;
  date: string;
  price: string;
  isActive: boolean;
  description: string;
  imageUrl: string;
};

const initialForm: EventForm = {
  title: "",
  category: "Music",
  city: "",
  date: "",
  price: "0",
  isActive: true,
  description: "",
  imageUrl: "",
};

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<EventForm>(initialForm);

  const [cardDesign, setCardDesign] =
    useState<CardDesign>(defaultCardDesign);
  const [hasCardDesign, setHasCardDesign] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");

  // Initialize bookmark status from the authenticated user's saved events.
  useEffect(() => {
    const bookmarkedEvents = user?.bookMarkedEvents ?? [];
    setIsBookmarked(bookmarkedEvents.map(String).includes(id));
  }, [user, id]);

  async function toggleBookmark() {
    if (!user) {
      router.push("/login");
      return;
    }

    // The provided API only adds bookmarks; it does not remove them.
    if (isBookmarked || bookmarkLoading) return;

    setBookmarkLoading(true);
    setBookmarkError("");

    try {
      const response = await axios.post(`/api/events/${id}/bookmark`);

      if (response.data.success) {
        setIsBookmarked(true);
      } else {
        setBookmarkError(
          response.data.message ?? "Unable to bookmark this event.",
        );
      }
    } catch (err) {
      setBookmarkError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ??
              "Unable to bookmark this event."
          : "Unable to bookmark this event.",
      );
    } finally {
      setBookmarkLoading(false);
    }
  }

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

  useEffect(() => {
    let cancelled = false;

    async function fetchCardDesign() {
      setCardDesign(defaultCardDesign);
      setHasCardDesign(false);

      try {
        const response = await axios.get(`/api/events/${id}/card-design`);

        if (cancelled) return;

        setCardDesign({
          theme: response.data.theme ?? "theme-1",
          stickers: response.data.stickers ?? [],
        });
        setHasCardDesign(true);
      } catch (err) {
        if (cancelled) return;

        if (
          axios.isAxiosError(err) &&
          err.response?.status === 404
        ) {
          setCardDesign(defaultCardDesign);
          setHasCardDesign(false);
          return;
        }

        console.error("Unable to fetch card design", err);
      }
    }

    void fetchCardDesign();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!event) return;

    const date = new Date(event.date);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60_000,
    )
      .toISOString()
      .slice(0, 16);

    setForm({
      title: event.title,
      category: event.category,
      city: event.city,
      date: localDate,
      price: String(event.price),
      description: event.description,
      isActive: event.isActive,
      imageUrl: event.imageUrl ?? "",
    });
  }, [event]);

  function updateForm<K extends keyof EventForm>(
    field: K,
    value: EventForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function updateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const response = await axios.patch(`/api/admin/events/${id}`, {
        ...form,
        price: Number(form.price),
        date: new Date(form.date).toISOString(),
      });

      setEvent(response.data.event);
      setEditing(false);
    } catch (err) {
      setFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to update event."
          : "Unable to update event.",
      );
    } finally {
      setSaving(false);
    }
  }

  const formattedDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));

  const cardThemeClass =
    cardDesign.theme === "theme-2"
      ? "border-[#a5b185] bg-[#e9eadb] text-[#303d30]"
      : cardDesign.theme === "theme-3"
        ? "border-[#a879b5] bg-[#241b2c] text-[#f1f1eb]"
        : "border-[#29332d] bg-[#111614] text-[#f1f1eb]";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f0e] text-[#a5b185]">
        <div className="text-center">
          <LoaderCircle className="mx-auto animate-spin" size={30} />
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm text-[#a5b185] transition hover:text-[#d0d9b5]"
          >
            <ArrowLeft size={17} />
            Back to your feed
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleBookmark}
              disabled={bookmarkLoading || isBookmarked}
              aria-label={isBookmarked ? "Event bookmarked" : "Bookmark event"}
              aria-pressed={isBookmarked}
              title={isBookmarked ? "Bookmarked" : "Bookmark event"}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition disabled:cursor-default ${
                isBookmarked
                  ? "border-[#a5b185] bg-[#a5b185]/10 text-[#c1cca5]"
                  : "border-[#29332d] text-[#c1cca5] hover:bg-[#151b17]"
              }`}
            >
              {bookmarkLoading ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Bookmark
                  size={17}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              )}
              <span className="hidden sm:inline">
                {bookmarkLoading
                  ? "Saving..."
                  : isBookmarked
                    ? "Bookmarked"
                    : "Bookmark"}
              </span>
            </button>

            <Link
              href={`/events/${event._id}/design`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#a5b185] px-4 py-2.5 text-sm font-semibold text-[#111614] transition hover:bg-[#bbc59a]"
            >
              <Pencil size={17} />
              {hasCardDesign ? "Edit Design" : "Design Card"}
            </Link>

            {user?.role === "Admin" && (
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  setEditing((current) => !current);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#454d43] px-4 py-2.5 text-sm font-semibold text-[#d8dfc4] transition hover:bg-[#151b17]"
              >
                {editing ? <X size={17} /> : <Pencil size={17} />}
                {editing ? "Cancel" : "Edit event"}
              </button>
            )}
          </div>
        </div>

        {bookmarkError && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
          >
            {bookmarkError}
          </p>
        )}

        <article className={`overflow-hidden rounded-3xl border ${cardThemeClass}`}>
          <div className="relative h-64 bg-[#1a211d] sm:h-96">
            {event.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <CalendarDays size={42} className="text-[#a5b185]" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

            <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-[#d8dfc4] backdrop-blur">
              {event.category}
            </span>

            {cardDesign.stickers.length > 0 && (
              <div className="absolute right-5 top-5 flex gap-2">
                {cardDesign.stickers.map((sticker) => {
                  const Icon = stickerIcons[sticker];

                  return (
                    <span
                      key={sticker}
                      className="rounded-full border border-white/15 bg-black/50 p-2 text-white backdrop-blur"
                    >
                      <Icon size={18} />
                    </span>
                  );
                })}
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/75">
                You&apos;re invited
              </p>
              <h1 className="text-3xl font-semibold text-white sm:text-5xl">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {editing && user?.role === "Admin" ? (
              <form onSubmit={updateEvent} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-[#c1c7bc]">
                    Event title
                  </label>
                  <input
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    className="w-full rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[#c1c7bc]">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        updateForm("category", e.target.value as Event["category"])
                      }
                      className="w-full rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                    >
                      {["Music", "Workshop", "Food", "Sports", "Kids"].map(
                        (category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#c1c7bc]">
                      City
                    </label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className="w-full rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#c1c7bc]">
                      Date and time
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={form.date}
                      onChange={(e) => updateForm("date", e.target.value)}
                      className="w-full rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#c1c7bc]">
                      Price (INR)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={(e) => updateForm("price", e.target.value)}
                      className="w-full rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#c1c7bc]">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => updateForm("imageUrl", e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#c1c7bc]">
                    Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    maxLength={3000}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    className="w-full resize-y rounded-xl border border-[#29332d] bg-[#0b0f0e] p-3 text-[#f1f1eb] outline-none focus:border-[#a5b185]"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-sm text-red-300">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end gap-3 border-t border-[#29332d] pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      setEditing(false);
                    }}
                    disabled={saving}
                    className="rounded-xl border border-[#29332d] px-5 py-3 text-sm text-[#c1c7bc] hover:bg-[#151b17] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#a5b185] px-5 py-3 text-sm font-semibold text-[#111614] hover:bg-[#bbc59a] disabled:opacity-50"
                  >
                    {saving ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-medium">{event.title}</h2>

                <p className="mt-5 whitespace-pre-wrap text-base leading-8 opacity-80">
                  {event.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-current/15 bg-black/[0.04] p-4">
                    <CalendarDays
                      size={21}
                      className="mt-1 shrink-0 text-[#a5b185]"
                    />
                    <div>
                      <p className="text-xs opacity-60">Date and time</p>
                      <p className="mt-2 text-sm leading-6">
                        {formattedDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-current/15 bg-black/[0.04] p-4">
                    <MapPin
                      size={21}
                      className="mt-1 shrink-0 text-[#a5b185]"
                    />
                    <div>
                      <p className="text-xs opacity-60">Location</p>
                      <p className="mt-2 text-sm">{event.city}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col justify-between gap-5 border-t border-current/15 pt-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm opacity-60">Entry price</p>
                    <p className="mt-1 text-3xl font-semibold text-[#a5b185]">
                      {event.price === 0
                        ? "Free"
                        : new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(event.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm opacity-60">
                    <Ticket size={19} className="text-[#a5b185]" />
                    Community event
                  </div>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}