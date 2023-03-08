import mongoose from "mongoose";

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

export default mongoose.model<ISpoontacularSearchResult>(
    "SpoonacularSearchResult",
    spoonacularSearchResultSchema
);
