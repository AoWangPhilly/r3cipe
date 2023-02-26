import mongoose from "mongoose";
import { RecipeType } from "backend/types.js";

interface ISpoonacularRecipe {
    recipeId: string;
    recipe: RecipeType | any; // will remove "any" after testing
    createdAt: Date;
}

const spoonacularRecipeSchema = new mongoose.Schema<ISpoonacularRecipe>({
    recipeId: { type: String, required: true, unique: true },
    recipe: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISpoonacularRecipe>(
    "SpoonacularRecipe",
    spoonacularRecipeSchema
);
