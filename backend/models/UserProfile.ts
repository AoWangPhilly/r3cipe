import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile {
    name: string;
    email: string;
    password: string;
    profileUrl: string;
}

export interface IUserProfileModel extends IUserProfile, Document {}

const UserProfileSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        profileUrl: { type: String, default: "" },
    },
    { versionKey: false }
);

export default mongoose.model<IUserProfileModel>(
    "UserProfile",
    UserProfileSchema
);
