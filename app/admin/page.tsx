
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  CirclePause,
  Plus,
  Search,
  MapPin,
  Clock3,
  X,
  LoaderCircle,
  ArrowUpRight,
} from "lucide-react";

type EventItem = {
  _id: string;
  title: string;
  category: "Music" | "Workshop" | "Food" | "Sports" | "Kids";
  city: string;
  date: string;
  price: number;
  description: string;
  imageUrl?: string;
  isActive: boolean;
};

type EventForm = {
  title: string;
  category: EventItem["category"];
  city: string;
  date: string;
  price: string;
  description: string;
  imageUrl: string;
};

const initialForm: EventForm = {
  title: "",
  category: "Music",
  city: "",
  date: "",
  price: "0",
  description: "",
  imageUrl: "",
};

type Filter = "all" | "active" | "inactive";

export default function AdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<EventForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [changingId, setChangingId] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/admin/events");
      setEvents(response.data.events ?? []);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to load events."
          : "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const activeCount = events.filter((event) => event.isActive).length;
  const inactiveCount = events.length - activeCount;

  const visibleEvents = events.filter((event) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && event.isActive) ||
      (filter === "inactive" && !event.isActive);

    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  const formatPrice = (price: number) =>
    price === 0
      ? "Free"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(price);

  async function createEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      await axios.post("/api/admin/events", {
        ...form,
        price: Number(form.price),
        date: new Date(form.date).toISOString(),
      });

      setForm(initialForm);
      setShowCreate(false);
      setFilter("all");
      await fetchEvents();
    } catch (err) {
      setFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to create event."
          : "Unable to create event."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(event: EventItem) {
    setChangingId(event._id);
    setError("");

    try {
      await axios.patch(`/api/admin/events/${event._id}/status`, {
        isActive: !event.isActive,
      });

      setEvents((current) =>
        current.map((item) =>
          item._id === event._id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to update event status."
          : "Unable to update event status."
      );
    } finally {
      setChangingId("");
    }
  }

  const stats = [
    {
      label: "Total events",
      value: events.length,
      key: "all" as const,
      icon: CalendarDays,
      description: "Every event in Gather",
    },
    {
      label: "Active events",
      value: activeCount,
      key: "active" as const,
      icon: CheckCircle2,
      description: "Visible to attendees",
    },
    {
      label: "Inactive events",
      value: inactiveCount,
      key: "inactive" as const,
      icon: CirclePause,
      description: "Currently unpublished",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f0e] text-[#f1f1eb]">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 grid-cols-2 gap-1">
              <span className="rounded-tl-xl rounded-br-md bg-[#a5b185]" />
              <span className="rounded-tr-xl rounded-bl-md bg-[#a5b185]" />
              <span className="rounded-bl-xl rounded-tr-md bg-[#a5b185]" />
              <span className="rounded-br-xl rounded-tl-md bg-[#a5b185]" />
            </div>
            <span className="text-[25px] font-semibold tracking-tight">
              Gather
            </span>
          </Link>

          <span className="rounded-full border border-[#a5b185]/30 px-3 py-1.5 text-xs font-medium text-[#c5cdb0]">
            ADMIN PANEL
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#a5b185]">
              OVERVIEW
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Event dashboard
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#9ba39a]">
              Manage your events, control visibility, and create new
              experiences for your community.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError("");
              setShowCreate(true);
            }}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#a5b185] px-4 py-3 text-sm font-semibold text-[#10140f] transition hover:bg-[#bbc59a]"
          >
            <Plus size={17} />
            Create event
          </button>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const selected = filter === stat.key;

            return (
              <button
                key={stat.key}
                onClick={() => setFilter(stat.key)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-[#a5b185]/60 bg-[#a5b185]/[0.08]"
                    : "border-white/[0.08] bg-[#111614] hover:border-white/20"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm text-[#a7aea4]">
                    {stat.label}
                  </span>
                  <Icon size={19} className="text-[#a5b185]" />
                </div>
                <div className="text-4xl font-semibold tracking-tight">
                  {loading ? "—" : stat.value}
                </div>
                <div className="mt-2 text-xs text-[#858e84]">
                  {stat.description}
                </div>
              </button>
            );
          })}
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">Your events</h2>
              <p className="mt-1 text-sm text-[#858e84]">
                {visibleEvents.length}{" "}
                {visibleEvents.length === 1 ? "event" : "events"} shown
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858e84]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, city, category..."
                className="w-full rounded-xl border border-white/10 bg-[#111614] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[#697169] focus:border-[#a5b185]/60"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {stats.map((stat) => (
              <button
                key={stat.key}
                onClick={() => setFilter(stat.key)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  filter === stat.key
                    ? "bg-[#a5b185] text-[#10140f]"
                    : "border border-white/10 text-[#a7aea4] hover:border-white/20"
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-200">
              <span>{error}</span>
              <button
                onClick={() => void fetchEvents()}
                className="underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#9ba39a]">
              <LoaderCircle className="animate-spin" size={19} />
              Loading events...
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-5 py-16 text-center">
              <CalendarDays
                size={30}
                className="mx-auto mb-4 text-[#a5b185]"
              />
              <h3 className="font-medium">No events found</h3>
              <p className="mt-2 text-sm text-[#858e84]">
                {search
                  ? "Try another search term."
                  : "Create an event or choose another status filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111614]">
              {visibleEvents.map((event, index) => (
                <article
                  key={event._id}
                  className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
                    index !== 0 ? "border-t border-white/[0.07]" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#202821]">
                      {event.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <CalendarDays
                            size={23}
                            className="text-[#a5b185]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium">
                        <Link
                          href={`/events/${event._id}`}
                          className="transition hover:text-[#a5b185]"
                        >
                          {event.title}
                        </Link>
                      </h3>

                      <p className="mt-1 text-xs text-[#a5b185]">
                        {event.category}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#929a90]">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {event.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} />
                          {formatDate(event.date)}
                        </span>
                        <span>{formatPrice(event.price)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs ${
                        event.isActive
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-white/[0.07] text-[#a0a69e]"
                      }`}
                    >
                      {event.isActive ? "Active" : "Inactive"}
                    </span>

                    <button
                      disabled={changingId === event._id}
                      onClick={() => void toggleStatus(event)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#c1c7bc] transition hover:border-[#a5b185]/50 disabled:opacity-50"
                    >
                      {changingId === event._id
                        ? "Saving..."
                        : event.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCreate(false);
          }}
        >
          <section className="my-4 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111614] p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs tracking-[0.18em] text-[#a5b185]">
                  NEW EXPERIENCE
                </p>
                <h2 className="text-2xl font-semibold">Create an event</h2>
                <p className="mt-2 text-sm text-[#929a90]">
                  Add the details for your next community event.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-[#9ba39a] hover:bg-white/[0.06]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createEvent} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[#c1c7bc]">
                  Event title
                </label>
                <input
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Sunday Music Meetup"
                  className="w-full rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[#c1c7bc]">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as EventForm["category"],
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
                  >
                    {["Music", "Workshop", "Food", "Sports", "Kids"].map(
                      (category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      )
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
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    placeholder="e.g. Bhopal"
                    className="w-full rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
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
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
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
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#c1c7bc]">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={3000}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What should attendees know?"
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#c1c7bc]">
                  Image URL <span className="text-[#858e84]">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b0f0e] px-4 py-3 text-sm outline-none focus:border-[#a5b185]/60"
                />
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-300">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/[0.08] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-[#c1c7bc] hover:bg-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a5b185] px-5 py-3 text-sm font-semibold text-[#10140f] hover:bg-[#bbc59a] disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {saving ? "Creating..." : "Create event"}
                  {!saving && <ArrowUpRight size={16} />}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
