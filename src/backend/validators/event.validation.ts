import { z } from "zod";

const getEventsQuerySchema = z.object({
  category: z
    .enum(["Music", "Workshop", "Food", "Sports", "Kids"])
    .optional(),
  city: z.string().trim().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters"),

  category: z.enum(["Music", "Workshop", "Food", "Sports", "Kids"]),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),

  date: z
    .string()
    .datetime({ message: "Date must be a valid ISO datetime" })
    .refine((date) => new Date(date) > new Date(), {
      message: "Event date must be in the future",
    }),

  price: z.coerce
    .number()
    .finite()
    .min(0, "Price cannot be negative"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description must be at most 5000 characters"),

  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be valid")
    .optional()
    .or(z.literal("")),
});

const updateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(150).optional(),

    category: z.enum(["Music", "Workshop", "Food", "Sports", "Kids"]).optional(),
    city: z.string().trim().min(1).max(100).optional(),
    date: z
      .string()
      .datetime()
      .refine((date) => new Date(date) > new Date(), {
        message: "Event date must be in the future",
      })
      .optional(),
    price: z.coerce.number().finite().min(0).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    imageUrl: z
      .string()
      .trim()
      .url("Invalid image URL")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the event",
});

const updateEventStatusSchema = z.object({
  isActive: z.boolean({
    message: "isActive must be a boolean",
  }),
});

export {getEventsQuerySchema,createEventSchema, updateEventSchema, updateEventStatusSchema}