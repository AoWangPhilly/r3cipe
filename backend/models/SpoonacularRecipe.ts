import mongoose from "mongoose";
import { RecipeType } from "backend/types.js";

interface ISpoonacularRecipe {
    recipeId: string;
    recipe: RecipeType; // will remove "any" after testing
    lastModified: Date;
    userId: null;
    isPublic: boolean;
}

const spoonacularRecipeSchema = new mongoose.Schema<ISpoonacularRecipe>(
    {
        recipeId: { type: String, required: true, unique: true },
        recipe: { type: Object, required: true },
        lastModified: { type: Date, default: Date.now },
        userId: { type: String, default: null },
        isPublic: { type: Boolean, default: true },
    },
    { versionKey: false }
);

interface ISpoontacularSearchResult {
    searchKey: string;
    recipeIds: string[];
}

const spoonacularSearchResultSchema =
    new mongoose.Schema<ISpoontacularSearchResult>(
        {
            searchKey: { type: String, required: true, unique: true },
            recipeIds: { type: [String], required: true },
        },
        { versionKey: false }
    );

export default (mongoose.model<ISpoonacularRecipe>(
    "SpoonacularRecipe",
    spoonacularRecipeSchema
),
mongoose.model<ISpoontacularSearchResult>(
    "SpoonacularSearchResult",
    spoonacularSearchResultSchema
));
