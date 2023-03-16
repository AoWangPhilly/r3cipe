import { Request, Response } from "express";
import { buildUrl } from "build-url-ts";
import axios from "axios";

import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import SpoonacularSearchResult from "../models/SearchResults.js";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import { parseRecipe } from "../helpers/recipeParser.js";
import Inventory from "../models/Inventory.js";
import { RecipeType, RecipeTypeWithId } from "../types/types.js";
import UserRecipe from "../models/UserRecipe.js";

const API_KEY = process.env.API_KEY;

/**
 * Spoonacular's complexSearch endpoint
 * Search by query, cuisine, meal type, and pantry
 * Performs 2 caches to save API reqs: Search results & Recipes
 * If search/recipe found in cache, use that. otherwise, make API req
 */
async function searchSpoonacularRecipes(req: Request, res: Response) {
    const { query, cuisine, mealtype, pantry } = req.query;
    const key = `${query}-${cuisine}`;
    const maxResults: number = 10;
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();

    // parameters are empty
    if (!query && !cuisine && !mealtype) {
        return res.status(400).json({ error: "no parameters provided" });
    }

    // console.log(query, cuisine, mealtype, pantry);
    let spoonacularUrl = "";

    // search for spoonacular recipes
    if (pantry === "true" && tokenStorage[token]) {
        const userPantry = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });

        spoonacularUrl = buildUrl("https://api.spoonacular.com", {
            path: "recipes/complexSearch",
            queryParams: {
                apiKey: API_KEY,
                query: query as string,
                type: mealtype as string,
                cuisine: cuisine as string,
                includeIngredients: userPantry?.pantry,
                addRecipeInformation: "true",
                fillIngredients: "true",
                number: maxResults,
            },
        });
    } else {
        spoonacularUrl = buildUrl("https://api.spoonacular.com", {
            path: "recipes/complexSearch",
            queryParams: {
                apiKey: API_KEY,
                query: query as string,
                type: mealtype as string,
                cuisine: cuisine as string,
                addRecipeInformation: "true",
                fillIngredients: "true",
                number: maxResults,
            },
        });

        const spoonacularRecipeResult = await SpoonacularSearchResult.findOne({
            searchKey: key,
        });

        // if the key is in the cache, return the cached result
        if (spoonacularRecipeResult && (pantry === "false" || pantry === "")) {
            console.log('Search Cache HIT for key: "' + key + '"');
            // if the key is in the cache, return the cached result
            return res.status(200).json({ spoonacularRecipeResult });
        }
    }

    console.log('Search Cache MISS for key: "' + key + '"');

    // if the key isn't in the cache, make thespoonacularrecipes request
    let recipes: RecipeTypeWithId[] = [];
    axios
        .get(spoonacularUrl)
        .then(async (response) => {
            response.data.results.forEach(async (recipe: any) => {
                const { recipeId, ...parsedRecipe } = parseRecipe(recipe);

                const spoonacularRecipe = new SpoonacularRecipe({
                    recipeId: recipeId,
                    recipe: parsedRecipe,
                    userId: "Spoonacular",
                });

                recipes.push({ recipeId, ...parsedRecipe });

                const recipeExists = await SpoonacularRecipe.findOne({
                    recipeId: recipeId,
                });
                if (recipeExists) {
                    console.log("Recipe already exists");
                } else {
                    await spoonacularRecipe
                        .save()
                        .then((recipe) => {
                            console.log("Recipe saved");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
                return recipes;
            });

            // Cache the search result
            const spoonacularRecipeResult = new SpoonacularSearchResult({
                searchKey: key,
                recipes: recipes,
            });

            // Only save when not including pantry
            if (pantry === "false" || pantry === "") {
                await spoonacularRecipeResult
                    .save()
                    .then((result) => {
                        console.log('Search result save at key: "' + key + '"');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            return res.status(200).json({ spoonacularRecipeResult });
        })
        .catch((error) => {
            return res.status(500).json({ error });
        });
}

/**
 * Returns Recipe from 1 of 3 places: User/Spoonacular Recipe, or Spoonacular API
 * If not in cache, store in MongoDB
 */
async function getRecipeById(req: Request, res: Response) {
    const { id } = req.params;

    // Check if the recipe is a user recipe
    if (id.startsWith("u")) {
        const recipe = await UserRecipe.findOne({ recipeId: id });

        if (recipe) {
            return res.status(200).json({ recipe });
        } else {
            return res.status(404).json({ error: "user recipe not found" });
        }
    }

    // Check if the recipe is a spoonacular recipe
    const recipe = await SpoonacularRecipe.findOne({ recipeId: id });
    if (recipe) {
        return res.status(200).json({ recipe });
    } else {
        let spoonacularUrl = buildUrl("https://api.spoonacular.com", {
            path: `recipes/${id}/information`,
            queryParams: {
                apiKey: API_KEY,
                includeNutrition: "false",
            },
        });

        // If recipe isn't in cache, API req to spoonacular and save to DB
        axios
            .get(spoonacularUrl)
            .then(async (response) => {
                console.log("Recipe not in cache, making API req");
                // console.log(response.data);
                const { recipeId, ...parsedRecipe } = parseRecipe(
                    response.data
                );
                const spoonacularRecipe = new SpoonacularRecipe({
                    recipeId: recipeId,
                    recipe: parsedRecipe,
                    userId: "Spoonacular",
                });

                await spoonacularRecipe
                    .save()
                    .then((recipe) => {
                        console.log("recipe saved");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                return res.status(200).json({ recipe: spoonacularRecipe });
            })
            .catch((error) => {
                console.log("error here");
                console.log(error);
                return res.status(404).json({ error: "recipe not found" });
            });
    }
}

async function getRandomSpoonacularRecipe(req: Request, res: Response) {
    const spoonacularUrl = buildUrl("https://api.spoonacular.com", {
        path: "recipes/random",
        queryParams: {
            apiKey: API_KEY,
            number: 4, // can set to anything
        },
    });

    const response = await axios.get(spoonacularUrl);
    if (response.status >= 400) {
        return res.status(500).json({ error: "Could not get random recipe" });
    }

    const randomRecipeList: RecipeTypeWithId[] = response.data.recipes.map(
        (recipe: RecipeType) => {
            const { ...parsedRecipe } = parseRecipe(recipe);
            return parsedRecipe;
        }
    );

    // Cache recipe if not already stored
    randomRecipeList.forEach(async (recipe) => {
        const recipeExists = await SpoonacularRecipe.findOne({
            recipeId: recipe.recipeId,
        });

        if (recipeExists) {
            console.log("Random recipe exists in cache");
        } else {
            const spoonacularRecipe = new SpoonacularRecipe({
                recipeId: recipe.recipeId,
                recipe: recipe,
                userId: "Spoonacular",
            });
            spoonacularRecipe
                .save()
                .then((recipe) => {
                    console.log(`Random recipe ${recipe.recipeId} saved`);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    res.json({ randomRecipeList });
}

export default {
    searchSpoonacularRecipes,
    getRecipeById,
    getRandomSpoonacularRecipe,
};
