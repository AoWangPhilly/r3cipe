import mongoose from "mongoose";

// stores reference/foreign key to Spoon/User-created recipes
export interface FavoriteRecipe {
    recipeId: string;
    date: Date;
}

// contains User's pantry items, list of fav recipes, & their own created recipes
export interface IInventory {
    userId: mongoose.Schema.Types.ObjectId;
    pantry: string[];
    favoritedRecipes: FavoriteRecipe[];
    myRecipes: string[];
}

const InventorySchema = new mongoose.Schema<IInventory>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserProfile",
            required: true,
        },
        pantry: { type: [String], default: [] },
        favoritedRecipes: { type: [Object], default: [] },
        myRecipes: { type: [String], default: [] },
    },
    { versionKey: false }
);

export default mongoose.model<IInventory>("Inventory", InventorySchema);
