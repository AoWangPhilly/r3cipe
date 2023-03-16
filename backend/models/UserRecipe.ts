import mongoose from "mongoose";
import { RecipeType } from "../types/types.js";

interface IUserRecipe {
    recipeId: string; // starts with a "u"
    recipe: RecipeType | null; // TODO?: remove null?
    userId: null; // TODO?: should be a ref to UserProfile's mongoid
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    // lastModified: Date;
}

const userRecipeSchema = new mongoose.Schema<IUserRecipe>(
    {
        recipeId: { type: String, unique: true },
        recipe: { type: Object, required: true },
        userId: { type: String, required: true },
        isPublic: { type: Boolean, required: true },
    },
    { versionKey: false, timestamps: true }
);
export default mongoose.model<IUserRecipe>("UserRecipe", userRecipeSchema);
