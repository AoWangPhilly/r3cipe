import mongoose from "mongoose";
import { RecipeType } from "../types/types.js";

// Defines the filtered Recipe from Spoonacular API that's cached in MongoDB
interface ISpoonacularRecipe {
    recipeId: string; // Spoonacular's "id"
    recipe: RecipeType | null; // TODO?: remove null?
    userId: null; // will be "Spoonacular" here
    isPublic: boolean;
    createdAt: boolean;
    updatedAt: boolean;
    review: {
        avgRating: number;
        numReviews: number;
    };
}

const spoonacularRecipeSchema = new mongoose.Schema<ISpoonacularRecipe>(
    {
        recipeId: { type: String, required: true, unique: true },
        recipe: { type: Object, required: true },
        userId: { type: String, default: null },
        isPublic: { type: Boolean, default: true },
        review: { type: Object, default: { avgRating: 0, numReviews: 0 } },
    },
    { versionKey: false, timestamps: true }
);
export default mongoose.model<ISpoonacularRecipe>(
    "SpoonacularRecipe",
    spoonacularRecipeSchema
);
