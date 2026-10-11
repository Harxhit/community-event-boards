import { z } from 'zod';
import mongoose from 'mongoose';
const categories = [
  "Music",
  "Workshop",
  "Food",
  "Sports",
  "Kids",
] as const;


export const updatePreferencesValidation = z.object({
  preferences: z
    .array(z.enum(categories))
    .min(1, "Select at least one category")
    .max(5, "You can select up to 5 categories")
    .refine(
      (values) => new Set(values).size === values.length,
      "Duplicate categories are not allowed"
    ),
});
