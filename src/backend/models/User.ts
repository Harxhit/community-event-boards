import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  name: string;
  profileImage?: string;
  password: string;
  role: 'User' | 'Admin';
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
  favouriteCategories?:  ('Music' | 'Workshop' | 'Food' | 'Sports' | 'Kids')[];
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Username is required.'],
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true, 
      required: [true, 'Email is required.'],
      unique: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    lastSeenAt: {
      type: Date,
    },
    favouriteCategories: {
      type : [String],
      enum: ['Music', 'Workshop', 'Food', 'Sports', 'Kids'],
      default: []
    }
  },
  { timestamps: true },
);

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;