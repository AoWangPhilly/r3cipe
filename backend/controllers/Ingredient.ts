import { Request, Response } from "express";
import IngredientModel, { IIngredient } from "../models/Ingredient.js";

// Create a new ingredient
export const createIngredient = async (req: Request, res: Response) => {
    const { id, name } = req.body;

    try {
        const ingredient: IIngredient = await IngredientModel.create({
            id,
            name,
        });
        return res.status(201).json({ ingredient });
    } catch (err) {
        return res.status(500).json({ error: "Error creating ingredient" });
    }
};

// Get all ingredients
export const getIngredients = async (req: Request, res: Response) => {
    try {
        const ingredients: IIngredient[] = await IngredientModel.find();
        return res.status(200).json({ ingredients });
    } catch (err) {
        return res.status(500).json({ error: "Error getting ingredients" });
    }
};

// Get a specific ingredient by id
export const getIngredientById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    try {
        const ingredient: IIngredient | null = await IngredientModel.findOne({
            id: id,
        });
        if (!ingredient) {
            return res.status(404).json({ error: "Ingredient not found" });
        }
        return res.status(200).json({ ingredient });
    } catch (err) {
        return res.status(500).json({ error: "Error getting ingredient" });
    }
};

// Update an ingredient by id
export const updateIngredient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log(name);
    console.log(id);
    try {
        const ingredient: IIngredient | null =
            await IngredientModel.findOneAndUpdate(
                { id: id },
                { name },
                { new: true }
            );
        if (!ingredient) {
            return res.status(404).json({ error: "Ingredient not found" });
        }
        return res.status(200).json({ ingredient });
    } catch (err) {
        return res.status(500).json({ error: "Error updating ingredient" });
    }
};

// Delete an ingredient by id
export const deleteIngredient = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const ingredient: IIngredient | null =
            await IngredientModel.findOneAndDelete({ id });
        if (!ingredient) {
            return res.status(404).json({ error: "Ingredient not found" });
        }
        return res
            .status(200)
            .json({ message: "Ingredient deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Error deleting ingredient" });
    }
};

export default {
    createIngredient,
    getIngredients,
    getIngredientById,
    updateIngredient,
    deleteIngredient,
};
