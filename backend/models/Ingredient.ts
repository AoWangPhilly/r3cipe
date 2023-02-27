import mongoose from "mongoose";

export interface IIngredient {
    id: string;
    name: string;
}

const IngredientSchema = new mongoose.Schema<IIngredient>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true, unique: true },
    },
    { versionKey: false }
);

export default mongoose.model<IIngredient>("Ingredient", IngredientSchema);
