import mongoose from "mongoose";

export interface IPost {
    userId: string;
    recipeId: string;
    timestamp: Date;
    comment: string;
}

export interface ISocialCircle {
    ownerId: string;
    members: string[];
    posts: IPost[];
    profileUrl: string;
    name: string;
}

export type ISocialCircleModel = ISocialCircle & Document;

const SocialCircleSchema = new mongoose.Schema<ISocialCircle>(
    {
        ownerId: { type: String, required: true },
        members: { type: [String], default: [] },
        posts: { type: [Object], default: [] },
        name: { type: String, required: true },
        profileUrl: { type: String, default: "" },
    },
    { versionKey: false }
);

export default mongoose.model<ISocialCircleModel>(
    "SocialCircle",
    SocialCircleSchema
);
