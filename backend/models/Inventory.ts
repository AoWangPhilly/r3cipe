import mongoose from "mongoose";

export interface FavoriteRecipe {
    recipeId: string;
    date: Date;
}

export interface IInventory {
    userId: string;
    pantry: string[];
    favoritedRecipes: FavoriteRecipe[];
    myRecipes: string[];
}

const InventorySchema = new mongoose.Schema<IInventory>(
    {
        userId: { type: String, required: true },
        pantry: { type: [String], default: [] },
        favoritedRecipes: { type: [Object], default: [] },
        myRecipes: { type: [String], default: [] },
    },
    { versionKey: false }
);

export default mongoose.model<IInventory>("Inventory", InventorySchema);
