import mongoose from "mongoose";
import { RecipeType } from "../types.js";

interface IUserRecipe {
    recipeId: string;
    recipe: RecipeType | null; // will remove "any" after testing
    lastModified: Date;
    userId: null;
    isPublic: boolean;
}

const userRecipeSchema = new mongoose.Schema<IUserRecipe>(
    {
        recipeId: { type: String, unique: true },
        recipe: { type: Object, required: true },
        lastModified: { type: Date, default: Date.now },
        userId: { type: String, required: true },
        isPublic: { type: Boolean, required: true },
    },
    { versionKey: false }
);
export default mongoose.model<IUserRecipe>("UserRecipe", userRecipeSchema);
