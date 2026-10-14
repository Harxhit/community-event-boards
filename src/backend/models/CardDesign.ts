import mongoose, { Schema } from "mongoose";

export interface CardDesignDocument {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  theme: "theme-1" | "theme-2" | "theme-3";
  stickers: string[];
}

const cardDesignSchema = new Schema<CardDesignDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: String,
      enum: ["theme-1", "theme-2", "theme-3"],
      default: "theme-1",
    },
    stickers: {
      type: [String],
      enum: ["music", "confetti", "star", "heart", "sparkles"],
      default: [],
      validate: {
        validator: (stickers: string[]) => stickers.length <= 3,
        message: "Maximum 3 stickers allowed per card",
      },
    },
  },
  { timestamps: true }
);

cardDesignSchema.index(
  { eventId: 1, userId: 1 },
  { unique: true }
);

const CardDesign = mongoose.models.CardDesign || mongoose.model<CardDesignDocument>("CardDesign", cardDesignSchema);
export default CardDesign