import { Request, Response } from "express";
import UserRecipe from "../models/UserRecipe.js";
import { v4 as uuidv4 } from "uuid";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import Inventory from "../models/Inventory.js";
import { RecipeType } from "../types.js";

const queryRecipes = async (req: Request, res: Response) => {
    const { query, cuisine, mealtype, pantry } = req.query;
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();

    let userPantry: string[] = [];
    if (pantry === "true" && tokenStorage[token] !== undefined) {
        userPantry = (await Inventory.findOne({
            userId: tokenStorage[token].id,
        })) as string[];
    }
    // search for user submitted recipes
    const allRecipes = await UserRecipe.find();
    const filteredRecipes = allRecipes.filter((recipe) => {
        const recipeContent = recipe.recipe as RecipeType;
        const queryMatch =
            recipeContent.title
                .toLowerCase()
                .includes(String(query).toLowerCase()) ||
            recipeContent.summary
                .toLowerCase()
                .includes(String(query).toLowerCase());
        const cuisineMatch = recipeContent.cuisines.some(
            (cuisineName) =>
                cuisineName.toLowerCase() === String(cuisine).toLowerCase()
        );
        const mealMatch = recipeContent.dishTypes.some(
            (mealTypeName) =>
                mealTypeName.toLowerCase() === String(mealtype).toLowerCase()
        );
        if (pantry === "true") {
            const pantryMatch = userPantry.every((ingredient) => {
                return recipeContent.extendedIngredients.some(
                    (recipeIngredient) => {
                        return (
                            recipeIngredient.originalName.toLowerCase() ===
                            ingredient.toLowerCase()
                        );
                    }
                );
            });
            if (queryMatch && cuisineMatch && mealMatch && pantryMatch) {
                console.log("reached 1");
                return true;
            }
        } else {
            if (queryMatch && cuisineMatch && mealMatch) {
                console.log("reached 2");
                return true;
            }
        }
        return false;
    });
    return res.status(200).json({ recipes: filteredRecipes });
};

const createRecipe = async (req: Request, res: Response) => {
    try {
        const { recipe, isPublic } = req.body;
        const recipeId = `u${uuidv4()}`;

        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        const userId = tokenStorage[token].id;

        const userRecipe = new UserRecipe({
            recipeId: recipeId,
            recipe: recipe,
            userId: userId,
            isPublic: isPublic,
        });

        // don't add when recipe exists with the same title
        const existingRecipe = await UserRecipe.findOne({
            userId: userId,
            "recipe.title": recipe.title,
        });
        if (existingRecipe) {
            return res.status(400).json({ message: "Recipe already exists" });
        }

        const savedUserRecipe = await userRecipe.save();

        const inventory = await Inventory.findOne({
            userId: userId,
        });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        inventory.myRecipes.push(recipeId);
        inventory.save();

        res.status(201).json({ userRecipe: savedUserRecipe });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const editRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { recipe, isPublic } = req.body;
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();

    try {
        let existingRecipe = await UserRecipe.findOne({ recipeId: id });
        if (!existingRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (!existingRecipe.recipeId.startsWith("u")) {
            return res
                .status(401)
                .json({ message: "Cannot edit spoontacular recipes" });
        }
        if (existingRecipe.userId !== tokenStorage[token].id) {
            return res.status(401).json({ message: "Not owner of recipe" });
        }

        if (recipe) {
            existingRecipe.recipe = recipe;
        }

        if (isPublic !== undefined) {
            existingRecipe.isPublic = isPublic;
        }

        if (recipe || isPublic !== undefined) {
            existingRecipe.lastModified = new Date();
        }

        const savedRecipe = await existingRecipe.save();
        res.status(201).json({ userRecipe: savedRecipe });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();
    try {
        const userId = tokenStorage[token].id;
        let existingRecipe = await UserRecipe.findOne({ recipeId: id });
        if (!existingRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (!existingRecipe.recipeId.startsWith("u")) {
            return res
                .status(401)
                .json({ message: "Cannot delete spoontacular recipes" });
        }
        if (existingRecipe.userId !== userId) {
            return res.status(401).json({ message: "Not owner of recipe" });
        }

        await existingRecipe.delete();

        const inventory = await Inventory.findOne({
            userId: userId,
        });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        inventory.myRecipes = inventory.myRecipes.filter(
            (id: string) => id !== id
        );
        inventory.save();

        res.status(201).json({ message: "Recipe deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    createRecipe,
    editRecipe,
    deleteRecipe,
    queryRecipes,
};
