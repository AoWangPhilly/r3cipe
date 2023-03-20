import { Request, Response } from "express";
import { buildUrl } from "build-url-ts";
import axios from "axios";

import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import SpoonacularSearchResult from "../models/SearchResults.js";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import { parseRecipe } from "../helpers/recipeParser.js";
import Inventory from "../models/Inventory.js";
import { RecipeTypeWithId } from "../types/types.js";
import UserRecipe from "../models/UserRecipe.js";
import { getApiKey, checkApiKey } from "../helpers/apiKey.js";

// const API_KEY = process.env.API_KEY;

/**
 * Spoonacular's complexSearch endpoint
 * Search by query, cuisine, meal type, and pantry
 * Performs 2 caches to save API reqs: Search results & Recipes
 * If search/recipe found in cache, use that. otherwise, make API req
 */
async function searchSpoonacularRecipes(req: Request, res: Response) {
    const { query, cuisine, mealtype, pantry, offset } = req.query;

    const key = `${query}-${cuisine}-${mealtype}-${offset ? offset : 0}`;
    const maxResults: number = 16;
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
                apiKey: getApiKey(),
                query: query as string,
                type: mealtype as string,
                cuisine: cuisine as string,
                includeIngredients: userPantry?.pantry,
                addRecipeInformation: "true",
                fillIngredients: "true",
                number: maxResults,
                offset: (offset ? offset : 0) as number,
            },
        });
    } else {
        spoonacularUrl = buildUrl("https://api.spoonacular.com", {
            path: "recipes/complexSearch",
            queryParams: {
                apiKey: getApiKey(),
                query: query as string,
                type: mealtype as string,
                cuisine: cuisine as string,
                addRecipeInformation: "true",
                fillIngredients: "true",
                number: maxResults,
                offset: (offset ? offset : 0) as number,
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
            let pointsLeft = response.headers["x-api-quota-left"];
            checkApiKey(pointsLeft);
            await response.data.results.forEach(async (recipe: any) => {
                const { recipeId, ...parsedRecipe } = await parseRecipe(recipe);

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

        //if recipe exists, and recipe is public OR recipe is private and user is logged in
        const tokenStorage = getTokenStorage();
        if (
            recipe &&
            (recipe.isPublic ||
                (req.cookies.token &&
                    recipe.userId === tokenStorage[req.cookies.token].id))
        ) {
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
        const spoonacularUrl = buildUrl("https://api.spoonacular.com", {
            path: `recipes/${id}/information`,
            queryParams: {
                apiKey: getApiKey(),
                includeNutrition: "false",
            },
        });

        // If recipe isn't in cache, API req to spoonacular and save to DB
        axios
            .get(spoonacularUrl)
            .then(async (response) => {
                let pointsLeft = response.headers["x-api-quota-left"];
                checkApiKey(pointsLeft);
                console.log(`Recipe ${id} not in cache, making API req`);
                // console.log(response.data);
                const { recipeId, ...parsedRecipe } = await parseRecipe(
                    response.data
                );
                const spoonacularRecipe = new SpoonacularRecipe({
                    recipeId: recipeId,
                    recipe: parsedRecipe,
                    userId: "Spoonacular",
                });

                /* await spoonacularRecipe
                    .save()
                    .then((recipe) => {
                        console.log("recipe saved");
                    })
                    .catch((error) => {
                        console.log(error);
                    }); */
                return res.status(200).json({ recipe: spoonacularRecipe });
            })
            .catch((error) => {
                console.log(`error in getting recipe with id ${id}`);
                // console.log(error);
                return res.status(404).json({ error: "recipe not found" });
            });
    }
}

/**
 * Return the Review (rating + number of reviews) of a recipe
 * NOTE: avgRating is the total rating; need to divide by numReviews to get average
 */
async function getRecipeReview(req: Request, res: Response) {
    const { id } = req.params;

    // check if user recipe
    if (id.startsWith("u")) {
        const recipe = await UserRecipe.findOne({ recipeId: id });

        if (recipe) {
            return res.status(200).json({ ...recipe.review });
        } else {
            return res.status(404).json({ error: "user recipe not found" });
        }
    }

    // spoonacular recipe
    const recipe = await SpoonacularRecipe.findOne({ recipeId: id });
    if (recipe) {
        return res.status(200).json({
            ...recipe.review,
        });
    }
    return res.status(404).json({ error: "recipe not found" });
}

async function getRandomSpoonacularRecipe(req: Request, res: Response) {
    const spoonacularUrl = buildUrl("https://api.spoonacular.com", {
        path: "recipes/random",
        queryParams: {
            apiKey: getApiKey(),
            number: 8, // can set to anything
        },
    });

    const response = await axios.get(spoonacularUrl);
    let pointsLeft = response.headers["x-api-quota-left"];
    checkApiKey(pointsLeft);
    if (response.status >= 400) {
        return res.status(500).json({ error: "Could not get random recipe" });
    }

    /* const randomRecipeList: RecipeTypeWithId[] = await response.data.recipes.map(
        async (recipe: RecipeType) => {
            const { ...parsedRecipe } = await parseRecipe(recipe);
            return parsedRecipe;
        }
    ); */
    let randomRecipeList: RecipeTypeWithId[] = [];
    await response.data.recipes.forEach(async (recipe: any) => {
        const { recipeId, ...parsedRecipe } = await parseRecipe(recipe);
        randomRecipeList.push({ recipeId, ...parsedRecipe });
    });

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

/**
 * Returns a list of recent recipes from the Cache
 * Used as "Trending Recipes" on the home page
 */
async function getRecentRecipes(req: Request, res: Response) {
    // randomly get 2 numbers summing to 16
    let spoonRecipes = Math.ceil(16 - Math.random() * 12);
    let userRecipes = 16 - spoonRecipes;
    const userRecentRecipes = await UserRecipe.find({
        isPublic: true,
    })
        .sort({ createdAt: -1 })
        .limit(userRecipes);

    if (userRecentRecipes.length <= userRecipes) {
        spoonRecipes += userRecipes - userRecentRecipes.length;
    } else if (userRecentRecipes.length > userRecipes) {
        userRecipes += userRecentRecipes.length - userRecipes;
    }

    const spoonacularRecentRecipes = await SpoonacularRecipe.find({
        userId: "Spoonacular",
    })
        .sort({ createdAt: -1 })
        .limit(spoonRecipes);

    if (
        spoonacularRecentRecipes.length === 0 &&
        userRecentRecipes.length === 0
    ) {
        return res.status(404).json({ error: "No recent recipes found" });
    }

    //combine the two lists fully and randomly
    const recentRecipes = [...spoonacularRecentRecipes, ...userRecentRecipes];
    recentRecipes.sort(() => Math.random() - 0.5);

    res.status(200).json({ recentRecipes });
}

export default {
    searchSpoonacularRecipes,
    getRandomSpoonacularRecipe,
    getRecentRecipes,
    getRecipeById,
    getRecipeReview,
};
