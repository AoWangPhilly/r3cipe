import mongoose from "mongoose";

//please change this to match the Post Type in the types folder :)
// this is how Users share Recipes within social circles
export interface IPost {
    userId: string;
    recipeId: string;
    timestamp: Date;
    comment: string; // TODO?: might need to set char limit here
}

export interface ISocialCircle {
    name: string;
    ownerId: mongoose.Schema.Types.ObjectId; // corresponds to User's mongo id
    members: string[]; // list of User mongo ids
    posts: IPost[];
    profileUrl: string;
}

export type ISocialCircleModel = ISocialCircle & Document;

const SocialCircleSchema = new mongoose.Schema<ISocialCircle>({
    name: { type: String, required: true },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
        required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
    posts: { type: [Object], default: [] },
    profileUrl: { type: String, default: "" },
});

export default mongoose.model<ISocialCircleModel>(
    "SocialCircle",
    SocialCircleSchema
);
