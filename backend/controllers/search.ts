import { Request, Response } from "express";
import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import SpoonacularSearchResult from "../models/SearchResults.js";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import axios from "axios";
import { parseRecipe } from "../helpers/recipeParser.js";
import Inventory from "../models/Inventory.js";

const API_KEY = process.env.API_KEY;

const fakeRecipe = {
    recipe: {
        title: "fake pasta",
        servings: 5,
        extendedIngredients: ["basil", "pasta"],
    },
};

// TODO: parsing + caching needed
async function searchSpoonacularRecipes(req: Request, res: Response) {
    const { query, cuisine, mealtype, pantry, usersubmitted } = req.query;
    const key = `${query}-${cuisine}`;
    const maxResults: number = 10;
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();

    // parameters are empty
    if (!query && !cuisine && !mealtype) {
        return res.status(400).json({ error: "no parameters provided" });
    }
    console.log(query, cuisine, mealtype, pantry);
    let spoonacularUrl = "";

    if (pantry && tokenStorage[token]) {
        const userPantry = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        const pantryIngredients = userPantry?.pantry.join(",");
        spoonacularUrl =
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}` +
            `&query=${query}&` +
            `type=${mealtype}&` +
            `cuisine=${cuisine}&` +
            `includeIngredients=${pantryIngredients}&` +
            `addRecipeInformation=true&` +
            `fillIngredients=true&` +
            `number=${maxResults}`;
    } else {
        spoonacularUrl =
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}` +
            `&query=${query}&` +
            `type=${mealtype}&` +
            `cuisine=${cuisine}&` +
            `addRecipeInformation=true&` +
            `fillIngredients=true&` +
            `number=${maxResults}`;
    }

    console.log(spoonacularUrl);

    const spoonacularRecipeResult = await SpoonacularSearchResult.findOne({
        searchKey: key,
    });

    if (spoonacularRecipeResult) {
        console.log("cache hit");
        // if the key is in the cache, return the cached result
        return res.status(200).json({ spoonacularRecipeResult });
    }
    console.log("cache miss");
    // if the key isn't in the cache, make the request
    axios
        .get(spoonacularUrl)
        .then((response) => {
            let recipeIds: string[] = [];
            response.data.results.forEach((recipe: any) => {
                const { recipeId, ...parsedRecipe } = parseRecipe(recipe);
                recipeIds.push(recipeId);

                const spoonacularRecipe = new SpoonacularRecipe({
                    recipeId: recipeId,
                    recipe: parsedRecipe,
                    userId: "Spoonacular",
                });

                console.log(spoonacularRecipe);

                spoonacularRecipe
                    .save()
                    .then((recipe) => {
                        console.log("recipe saved");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });

            const spoonacularRecipeResult = new SpoonacularSearchResult({
                searchKey: key,
                recipeIds: recipeIds,
            });

            console.log(key);
            console.log(recipeIds);
            console.log(spoonacularRecipeResult);
            spoonacularRecipeResult
                .save()
                .then((result) => {
                    console.log("result saved");
                })
                .catch((error) => {
                    console.log(error);
                });
            return res.status(200).json({ spoonacularRecipeResult });
        })
        .catch((error) => {
            return res.status(500).json({ error });
        });
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

async function getRecipeById(req: Request, res: Response) {
    const { id } = req.params;
    const recipe = await SpoonacularRecipe.findOne({ recipeId: id });
    if (recipe) {
        return res.status(200).json({ recipe });
    }
    return res.status(404).json({ error: "recipe not found" });
}

export default {
    createSpoonacularRecipe,
    searchSpoonacularRecipes,
    searchUserRecipes,
    getRecipeById,
};
