import { Request, Response } from "express";
import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import SpoonacularSearchResult from "../models/SpoonacularRecipe.js";

import { getTokenStorage } from "../helpers/tokenStorage.js";
import axios from "axios";
import { parseRecipe } from "../helpers/recipeParser.js";

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
    const { query, cuisine, mealtype, pantry } = req.query;
    const key = `${query}-${cuisine}`;
    const { token } = req.cookies;
    if (pantry && token) {
        const tokenStorage = getTokenStorage();
        console.log(tokenStorage[token]);
        // get pantry from the collections given the id
    }

    console.log(query, cuisine, mealtype, pantry);
    // parameters are empty
    if (!query && !cuisine && !mealtype) {
        return res.status(400).json({ error: "no parameters provided" });
    }

    const spoonacularUrl =
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}` +
        `&query=${query}&` +
        `type=${mealtype}&` +
        `cuisine=${cuisine}&` +
        `addRecipeInformation=true&` +
        `fillIngredients=true&` +
        `number=10`;
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
            const savedResult = spoonacularRecipeResult
                .save()
                .then((result) => {
                    console.log("result saved");
                })
                .catch((error) => {
                    console.log(error);
                });
            return res.status(200).json({ savedResult });
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

export default {
    createSpoonacularRecipe,
    searchSpoonacularRecipes,
    searchUserRecipes,
};
