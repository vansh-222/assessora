// lib/models/User.ts

import mongoose, {
  Schema,
  type Model,
  type HydratedDocument,
} from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Reuse the existing model during Next.js hot reloads
export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);