import { Request, Response } from "express";
import { buildUrl } from "build-url-ts";
import axios from "axios";

import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import SpoonacularSearchResult from "../models/SearchResults.js";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import { parseRecipe } from "../helpers/recipeParser.js";
import Inventory from "../models/Inventory.js";
import { RecipeType, RecipeTypeWithId } from "../types.js";
import UserRecipe from "../models/UserRecipe.js";

const API_KEY = process.env.API_KEY;

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
    if (usersubmitted === "true") {
        const allRecipes = await UserRecipe.find();
        const filteredRecipes = allRecipes.filter(async (recipe) => {
            const recipeContent = recipe.recipe as RecipeType;
            const queryMatch = recipeContent.title.includes(query as string);
            const recipeMatch = recipeContent.cuisines.includes(
                cuisine as string
            );
            const mealMatch = recipeContent.dishTypes.includes(
                mealtype as string
            );
            if (pantry === "true") {
                const userPantry = await Inventory.findOne({
                    userId: tokenStorage[token].id,
                });
                const pantryMatch = userPantry?.pantry.every((ingredient) => {
                    return recipeContent.extendedIngredients.some(
                        (recipeIngredient) => {
                            return recipeIngredient.originalName === ingredient;
                        }
                    );
                });
                if (queryMatch && recipeMatch && mealMatch && pantryMatch) {
                    return true;
                }
            } else {
                if (queryMatch && recipeMatch && mealMatch) {
                    return true;
                }
            }
        });
        return res.status(200).json({ recipes: filteredRecipes });
    }

    // console.log(query, cuisine, mealtype, pantry);
    let spoonacularUrl = "";

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

        if (spoonacularRecipeResult && (pantry === "false" || pantry === "")) {
            console.log('Search Cache HIT for key: "' + key + '"');
            // if the key is in the cache, return the cached result
            return res.status(200).json({ spoonacularRecipeResult });
        }
    }

    console.log('Search Cache MISS for key: "' + key + '"');
    // if the key isn't in the cache, make thespoonacularrecipesspoonacularrecipes request
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

async function getRecipeById(req: Request, res: Response) {
    const { id } = req.params;
    if (id.startsWith("u")) {
        const recipe = await UserRecipe.findOne({ recipeId: id });

        if (recipe) {
            return res.status(200).json({ recipe });
        } else {
            return res.status(404).json({ error: "user recipe not found" });
        }
    }

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

        axios
            .get(spoonacularUrl)
            .then(async (response) => {
                console.log(response.data);
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

export default {
    searchSpoonacularRecipes,
    getRecipeById,
};
