import { RecipeTypeWithId } from "../types.js";
import mongoose from "mongoose";

interface ISpoontacularSearchResult {
    searchKey: string;
    recipes: RecipeTypeWithId[]; // stores the whole Recipe object
}

const spoonacularSearchResultSchema =
    new mongoose.Schema<ISpoontacularSearchResult>(
        {
            searchKey: { type: String, required: true, unique: true },
            recipes: { type: [Object], required: true },
        },
        { versionKey: false }
    );

export default mongoose.model<ISpoontacularSearchResult>(
    "SpoonacularSearchResult",
    spoonacularSearchResultSchema
);
