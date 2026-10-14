import { z } from "zod";

export const cardDesignSchema = z.object({
  theme: z.enum(["theme-1", "theme-2", "theme-3"]).default("theme-1"),

  stickers: z
    .array(z.enum(["music", "confetti", "star", "heart", "sparkles"]))
    .max(3, "Maximum 3 stickers allowed per card")
    .default([]),
});

export const updateCardDesignSchema = z.object({
  theme: z.enum(["theme-1", "theme-2", "theme-3"]).optional(),

  stickers: z
    .array(z.enum(["music", "confetti", "star", "heart", "sparkles"]))
    .max(3, "Maximum 3 stickers allowed per card")
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);
