import Inventory from "../models/Inventory.js";
import { NextFunction, Request, Response } from "express";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import UserRecipe from "../models/UserRecipe.js";

// we update the whole Pantry instead of adding elements to it
const updatePantry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const { pantry } = req.body;
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        inventory.pantry = pantry;
        inventory.save();
        // Send response
        res.status(201).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getPantry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        // Send response
        res.status(201).json(inventory.pantry);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const addRecipeToFavorite = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { id } = req.params;
        console.log(id);
        const recipe = SpoonacularRecipe.findOne({ id });
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        const isRecipeInInventory = inventory.favoritedRecipes.some(
            (recipe) => recipe.recipeId === id
        );
        if (isRecipeInInventory) {
            return res
                .status(400)
                .json({ message: "Recipe already in inventory" });
        }

        inventory.favoritedRecipes.push({
            recipeId: id,
            date: new Date(),
        });

        // sort the favorite recipes
        inventory.favoritedRecipes.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );

        inventory.save();
        // Send response
        res.status(201).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const removeRecipeFromFavorite = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const { id } = req.params;
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        inventory.favoritedRecipes = inventory.favoritedRecipes.filter(
            (recipe) => recipe.recipeId !== id
        );

        // sort the favorite recipes
        inventory.favoritedRecipes.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );

        inventory.save();
        // Send response
        res.status(201).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getFavoriteRecipes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        let allRecipes = [];
        for (let i = 0; i < inventory.favoritedRecipes.length; i++) {
            //check if id prefaced with "u"
            console.log(inventory.favoritedRecipes[i].recipeId);
            const recipeId = inventory.favoritedRecipes[i].recipeId;
            let recipe;
            if (recipeId[0] === "u") {
                recipe = await UserRecipe.findOne({
                    recipeId: inventory.favoritedRecipes[i].recipeId,
                });
            } else {
                recipe = await SpoonacularRecipe.findOne({
                    recipeId: inventory.favoritedRecipes[i].recipeId,
                });
            }
            console.log(recipe?.recipeId);
            allRecipes.push(recipe);
        }
        console.log(allRecipes);

        // Send response
        res.status(201).json(allRecipes);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMyRecipes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        let allRecipes = [];
        for (let i = 0; i < inventory.myRecipes.length; i++) {
            const recipe = await UserRecipe.findOne({
                recipeId: inventory.myRecipes[i],
            });
            allRecipes.push(recipe);
        }
        res.status(201).json(allRecipes);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    updatePantry,
    getPantry,
    addRecipeToFavorite,
    removeRecipeFromFavorite,
    getFavoriteRecipes,
    getMyRecipes,
};
