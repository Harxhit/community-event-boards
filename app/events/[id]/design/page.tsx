
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Music,
  Sparkles,
  Star,
  Heart,
  PartyPopper,
  Check,
  LoaderCircle,
  Save,
} from "lucide-react";

type Theme = "theme-1" | "theme-2" | "theme-3";
type Sticker = "music" | "confetti" | "star" | "heart" | "sparkles";

interface Event {
  _id: string;
  title: string;
  category: string;
  city: string;
  date: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface CardDesign {
  theme: Theme;
  stickers: Sticker[];
}

const themes: { id: Theme; name: string; description: string }[] = [
  { id: "theme-1", name: "Midnight", description: "Dark and cinematic" },
  { id: "theme-2", name: "Botanical", description: "Soft and natural" },
  { id: "theme-3", name: "Festival", description: "Bold and energetic" },
];

const stickerOptions: {
  id: Sticker;
  label: string;
  Icon: typeof Music;
}[] = [
  { id: "music", label: "Music", Icon: Music },
  { id: "confetti", label: "Confetti", Icon: PartyPopper },
  { id: "star", label: "Star", Icon: Star },
  { id: "heart", label: "Heart", Icon: Heart },
  { id: "sparkles", label: "Sparkles", Icon: Sparkles },
];

const defaultDesign: CardDesign = {
  theme: "theme-1",
  stickers: [],
};

const themeStyles: Record<Theme, string> = {
  "theme-1": "bg-[#151b19] text-[#f1f1eb] border-[#59664d]",
  "theme-2": "bg-[#e9eadb] text-[#303d30] border-[#a5b185]",
  "theme-3": "bg-gradient-to-br from-[#54264f] via-[#382451] to-[#172d48] text-white border-[#a879b5]",
};

export default function CardDesignPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [design, setDesign] = useState<CardDesign>(defaultDesign);
  const [hasDesign, setHasDesign] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const eventResponse = await axios.get(`/api/events/${id}`);
        if (cancelled) return;

        const eventData: Event = eventResponse.data.event;
        setEvent(eventData);

        try {
          const designResponse = await axios.get(
            `/api/events/${id}/card-design`
          );

          if (cancelled) return;

          const savedDesign = designResponse.data.cardDesign ??
            designResponse.data;

          if (savedDesign.theme) {
            setDesign({
              theme: savedDesign.theme,
              stickers: savedDesign.stickers ?? [],
            });
            setHasDesign(true);
          }
        } catch (err) {
          if (
            !axios.isAxiosError(err) ||
            err.response?.status !== 404
          ) {
            throw err;
          }
          // No saved design yet: use the default theme.
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Unable to load the card editor."
            : "Unable to load the card editor."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function toggleSticker(sticker: Sticker) {
    setNotice("");
    setDesign((current) => {
      const selected = current.stickers.includes(sticker);

      if (selected) {
        return {
          ...current,
          stickers: current.stickers.filter((item) => item !== sticker),
        };
      }

      if (current.stickers.length >= 3) return current;

      return {
        ...current,
        stickers: [...current.stickers, sticker],
      };
    });
  }

  async function saveDesign() {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const url = `/api/events/${id}/card-design`;
      const response = hasDesign
        ? await axios.patch(url, design)
        : await axios.post(url, design);

      setHasDesign(true);
      setNotice("Your card design has been saved.");
      if (response.data.cardDesign) {
        setDesign({
          theme: response.data.cardDesign.theme,
          stickers: response.data.cardDesign.stickers ?? [],
        });
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Unable to save your design."
          : "Unable to save your design."
      );
    } finally {
      setSaving(false);
    }
  }

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0f0e] text-[#a5b185]">
        <LoaderCircle className="animate-spin" size={30} />
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0f0e] px-5 text-[#f1f1eb]">
        <p>{error}</p>
        <button onClick={() => router.back()} className="text-[#a5b185] underline">
          Go back
        </button>
      </main>
    );
  }

  if (!event) return null;

  return (
    <main className="min-h-screen bg-[#0b0f0e] text-[#f1f1eb]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href={`/events/${id}`} className="inline-flex items-center gap-2 text-sm text-[#a5b185] hover:text-[#d8dfc4]">
            <ArrowLeft size={17} />
            Back to event
          </Link>
          <span className="text-sm text-[#929a93]">Gather / Card designer</span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a5b185]">
            Make it yours
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Design your event card.
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#929a93]">
            Choose a theme, add a few details, and preview your card before saving.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Live preview */}
          <section className="lg:sticky lg:top-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Live preview</h2>
              <span className="text-xs text-[#929a93]">Theme: {themes.find((t) => t.id === design.theme)?.name}</span>
            </div>

            <article className={`overflow-hidden rounded-3xl border shadow-2xl transition-colors ${themeStyles[design.theme]}`}>
              <div className="relative h-64 overflow-hidden sm:h-80">
                {event.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-black/10">
                    <CalendarDays size={48} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs backdrop-blur">
                  {event.category}
                </span>

                <div className="absolute right-5 top-5 flex gap-2">
                  {design.stickers.map((sticker) => {
                    const item = stickerOptions.find((s) => s.id === sticker);
                    if (!item) return null;
                    const Icon = item.Icon;
                    return (
                      <span key={sticker} className="rounded-full bg-black/45 p-2 text-white backdrop-blur">
                        <Icon size={19} />
                      </span>
                    );
                  })}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/75">
                    You&apos;re invited
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight sm:text-4xl">
                    {event.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="line-clamp-3 text-sm leading-6 opacity-80">
                  {event.description}
                </p>

                <div className="mt-6 grid gap-4 border-t border-current/15 pt-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays size={18} className="mt-0.5 shrink-0 opacity-70" />
                    <div>
                      <p className="text-xs opacity-60">Date & time</p>
                      <p className="mt-1 text-sm">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 opacity-70" />
                    <div>
                      <p className="text-xs opacity-60">Location</p>
                      <p className="mt-1 text-sm">{event.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <p className="mt-3 text-xs leading-5 text-[#737d74]">
              This preview updates as you customize the card.
            </p>
          </section>

          {/* Controls */}
          <section className="space-y-8">
            <div className="rounded-2xl border border-[#29332d] bg-[#111614] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Choose a theme</h2>
                <span className="text-xs text-[#929a93]">3 themes</span>
              </div>

              <div className="mt-5 grid gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setDesign((current) => ({ ...current, theme: theme.id }));
                      setNotice("");
                    }}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                      design.theme === theme.id
                        ? "border-[#a5b185] bg-[#a5b185]/[0.08]"
                        : "border-[#29332d] hover:border-[#59664d]"
                    }`}
                  >
                    <span className={`h-12 w-12 shrink-0 rounded-lg border ${themeStyles[theme.id]}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{theme.name}</span>
                      <span className="mt-1 block text-xs text-[#929a93]">{theme.description}</span>
                    </span>
                    {design.theme === theme.id && <Check size={18} className="text-[#a5b185]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#29332d] bg-[#111614] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium">Add stickers</h2>
                <span className="text-xs text-[#929a93]">{design.stickers.length}/3 selected</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#929a93]">
                Choose up to three details for your card.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {stickerOptions.map(({ id: sticker, label, Icon }) => {
                  const selected = design.stickers.includes(sticker);
                  const disabled = !selected && design.stickers.length >= 3;

                  return (
                    <button
                      key={sticker}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleSticker(sticker)}
                      className={`relative flex min-h-24 flex-col items-center justify-center gap-3 rounded-xl border p-4 transition ${
                        selected
                          ? "border-[#a5b185] bg-[#a5b185]/[0.08] text-[#d8dfc4]"
                          : "border-[#29332d] text-[#b4bcb6] hover:border-[#59664d]"
                      } disabled:cursor-not-allowed disabled:opacity-35`}
                    >
                      {selected && <Check size={14} className="absolute right-2 top-2 text-[#a5b185]" />}
                      <Icon size={23} />
                      <span className="text-xs">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            {notice && (
              <p role="status" className="rounded-xl border border-[#59664d] bg-[#a5b185]/[0.07] p-3 text-sm text-[#d8dfc4]">
                {notice}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveDesign}
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#a5b185] px-5 py-3.5 text-sm font-semibold text-[#111614] transition hover:bg-[#bbc59a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving..." : hasDesign ? "Save changes" : "Save design"}
              </button>

              <Link
                href={`/events/${id}`}
                className="inline-flex items-center justify-center rounded-xl border border-[#29332d] px-5 py-3.5 text-sm text-[#d5d9d1] transition hover:bg-white/[0.03]"
              >
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
