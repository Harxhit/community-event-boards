import { Schema } from "mongoose";
import mongoose from "mongoose";

export interface EventDocument {
    publisher: mongoose.Schema.Types.ObjectId; 
    title: string; 
    category: "Music" | "Workshop" | "Food" | "Sports" | "Kids";
    city: string; 
    date: Date
    price: number 
    description: string
    imageUrl: string
    isActive: boolean
}

const EventScehma = new Schema<EventDocument>({
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Publisher is required']
    }, 
    title: {
        type: String,
        required: [true, 'Title is required']
    }, 
    city: {
        type: String,
        required: [true, 'City is required']
    }, 
    date: {
        type: Date,
        required: [true, 'Date is required']
    }, 
    description: {
        type: String,
        required: [true, 'Description is required']
    }, 
    imageUrl: {
        type: String, 
        required: [true, 'ImageUrl is required']
    }, 
    isActive: {
        type: Boolean, 
        default: true
    }, 
    category: {
        type: String,
        enum: ["Music", "Workshop", "Food", "Sports", "Kids"],
        required: [true, "Category is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    }, 
    {timestamps: true}
)


EventScehma.index({isActive: 1, date: 1})
EventScehma.index({isActive: 1, category: 1, date: 1})

const Event = mongoose.models.Event || mongoose.model<EventDocument>("Event", EventScehma);
export default Event