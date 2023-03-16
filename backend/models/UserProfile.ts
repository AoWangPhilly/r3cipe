import mongoose, { Document, Schema } from "mongoose";
import * as z from "zod";

/**
 * Zod validation for Login/Signup
 */
export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .min(1, { message: "Email must not be empty" })
        .email({ message: "Email is invalid" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must have at least 6 characters" }),
});

export const createUserProfileSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(2, { message: "Name must have at least 2 characters" }),
    email: z.string().email(),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must have at least 6 characters" }),
    profileUrl: z.string().optional(),
    createdAt: z.date().optional(),
});

// TODO: Delete?
export const updateUserProfileSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    profileUrl: z.string().optional(),
});

export type IUserProfile = z.infer<typeof createUserProfileSchema>;
export type UserProfileId = IUserProfile & {_id: mongoose.Schema.Types.ObjectId};

export type IUserProfileModel = IUserProfile & Document;

const UserProfileSchema: Schema = new Schema<IUserProfile>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileUrl: { type: String, default: "" },
    },
    { versionKey: false, timestamps: true }
);

export default mongoose.model<IUserProfileModel>(
    "UserProfile",
    UserProfileSchema
);
