import mongoose from "mongoose";
// this is how Users share Recipes within social circles
import { PostType } from "../types/types.js";

export interface ISocialCircle {
    name: string;
    description: string;
    ownerId: mongoose.Schema.Types.ObjectId; // corresponds to User's mongo id
    members: string[]; // list of User mongo ids; TODO: change to ObjectId[]
    posts: PostType[];
    profileUrl: string;
}

export type ISocialCircleModel = ISocialCircle & Document;

const SocialCircleSchema = new mongoose.Schema<ISocialCircle>({
    name: { type: String, required: true },
    description: {
        type: String,
        required: true,
        maxlength: [150, "Must be less than 150 characters"],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
        required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
    posts: [
        {
            type: Object,
            validate: [
                (post: PostType) => post.message.message.length <= 250,
                "Message must be less than 250 characters",
            ],
        },
    ],
    profileUrl: { type: String, default: "" },
});

export default mongoose.model<ISocialCircleModel>(
    "SocialCircle",
    SocialCircleSchema
);
