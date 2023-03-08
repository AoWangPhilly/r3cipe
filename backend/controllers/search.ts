import { Request, Response } from "express";
import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_KEY = process.env.API_KEY;

console.log(API_KEY);

const fakeRecipe = {
    recipe: {
        title: "fake pasta",
        servings: 5,
        extendedIngredients: ["basil", "pasta"],
    },
};

// TODO: parsing + caching needed
function searchSpoonacularRecipes(req: Request, res: Response) {
    const { query, cuisine, pantry } = req.params;
    const key = `${query}-${cuisine}-${pantry}`;
}

// TODO: parsing + caching needed
function searchUserRecipes(req: Request, res: Response) {
    const { query, cuisine, pantry } = req.params;
    const key = `${query}-${cuisine}-${pantry}`;
}

// TODO: input validation (actually, DELETE this endpoint?)
function createSpoonacularRecipe() {
    const spoonacularRecipe = new SpoonacularRecipe({
        recipeId: String(Math.floor(Math.random() * (1000 - 1 + 1) + 1)),
        recipe: fakeRecipe.recipe,
    });

    return spoonacularRecipe
        .save()
        .then((recipe) => {
            console.log("recipe saved");
            // res.status(201).json({ spoonacularRecipe });
        })
        .catch((error) => {
            console.log(error);
            // res.status(500).json({ error });
        });
}

export default {
    createSpoonacularRecipe,
    searchSpoonacularRecipes,
    searchUserRecipes,
};
