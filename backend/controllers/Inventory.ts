import Inventory from "../models/Inventory.js";
import { Request, Response } from "express";
import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import UserRecipe from "../models/UserRecipe.js";
import { buildUrl } from "build-url-ts";
import axios from "axios";
import { parseRecipe } from "../helpers/recipeParser.js";
import { checkApiKey, getApiKey } from "../helpers/apiKey.js";

// const API_KEY = process.env.API_KEY;

// we update the whole Pantry instead of adding elements to it
const updatePantry = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const { pantry } = req.body;
        const inventory = await Inventory.findOne({
            userId: user.id,
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

const getPantry = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const inventory = await Inventory.findOne({
            userId: user.id,
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

const addRecipeToFavorite = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const { id } = req.params;
        // console.log(id);
        const recipe = SpoonacularRecipe.findOne({ id });
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const inventory = await Inventory.findOne({
            userId: user.id,
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

const removeRecipeFromFavorite = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const { id } = req.params;
        const inventory = await Inventory.findOne({
            userId: user.id,
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

const getFavoriteRecipes = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const inventory = await Inventory.findOne({
            userId: user.id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        let allRecipes = [];
        for (let i = 0; i < inventory.favoritedRecipes.length; i++) {
            //check if id prefaced with "u"
            // console.log(inventory.favoritedRecipes[i].recipeId);
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

                // console.log(!recipe ? recipe : "present");
                const idTemp = inventory.favoritedRecipes[i].recipeId;
                if (!recipe) {
                    const spoonacularUrl = buildUrl(
                        "https://api.spoonacular.com",
                        {
                            path: `recipes/${idTemp}/information`,
                            queryParams: {
                                apiKey: getApiKey(),
                                includeNutrition: "false",
                            },
                        }
                    );

                    console.log("Recipe not in cache, making API req");
                    const response = await axios.get(spoonacularUrl);
                    const data = response.data;
                    let pointsLeft = response.headers["x-api-quota-left"];
                    checkApiKey(pointsLeft);
                    // TODO: might need error catching here?

                    // console.log(response.data);
                    const { recipeId, ...parsedRecipe } = await parseRecipe(
                        data
                    );
                    const spoonacularRecipe = new SpoonacularRecipe({
                        recipeId: recipeId,
                        recipe: parsedRecipe,
                        userId: "Spoonacular",
                    });

                    spoonacularRecipe.save();
                    recipe = spoonacularRecipe;
                }
            }
            allRecipes.push(recipe);
        }

        // Send response
        return res.status(201).json(allRecipes);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMyRecipes = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const inventory = await Inventory.findOne({
            userId: user.id,
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

/**
 * Gets a User's review (rating) for a recipe
 */
async function getUserReviewForRecipe(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    try {
        const inventory = await Inventory.findOne({
            userId: user.id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        // find the review by recipeId in the inventory
        const review = inventory.myReviews.find(
            (review) => review.recipeId === id
        );
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(201).json({ rating: review.rating });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Creates/updates a User's review (rating) for a recipe
 * Updates the Recipe's avgRating / numReviews
 */
async function updateUserReviewForRecipe(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating) {
        return res.status(400).json({ message: "Rating is required" });
    }

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 0-5" });
    }

    try {
        const inventory = await Inventory.findOne({
            userId: user.id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        // find the review by recipeId in the inventory
        const review = inventory.myReviews.find(
            (review) => review.recipeId === id
        );

        let ratingDiff = 0;

        if (!review) {
            // create a new review
            const newReview = {
                recipeId: id,
                rating: rating,
            };
            console.log(newReview);
            ratingDiff = rating;
            inventory.myReviews.push(newReview);

            await inventory.save();
            await updateAvgRecipeRating(id, ratingDiff, 1);
            return res.status(201).json({ message: "Review updated" });
        } else {
            // update the review
            ratingDiff = rating - review.rating;
            review.rating = rating;

            await inventory.save();
            await updateAvgRecipeRating(id, ratingDiff, 0);
            return res.status(201).json({ message: "Review updated" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Updates User/Spoonacular recipe's avgRating / numReviews
 */
async function updateAvgRecipeRating(id: string, ratingDiff: number, numReviews: number) {
    // update the average rating for the recipe
    if (id.startsWith("u")) {
        const recipe = await UserRecipe.findOne({ recipeId: id });

        if (recipe) {
            recipe.review.avgRating = recipe.review.avgRating + ratingDiff;
            recipe.review.numReviews = recipe.review.numReviews + numReviews;
            recipe.markModified("review");
            await recipe.save();
        }
    } else {
        // spoonacular recipe
        const recipe = await SpoonacularRecipe.findOne({ recipeId: id });
        console.log(recipe?.recipeId, recipe?.review);
        if (recipe) {
            recipe.review.avgRating = recipe.review.avgRating + ratingDiff;
            recipe.review.numReviews = recipe.review.numReviews + numReviews;
            recipe.markModified("review");
            await recipe.save();
            console.log(recipe?.recipeId, recipe?.review);
        }
    }
}

export default {
    updatePantry,
    getPantry,
    addRecipeToFavorite,
    removeRecipeFromFavorite,
    getFavoriteRecipes,
    getMyRecipes,
    getUserReviewForRecipe,
    updateUserReviewForRecipe,
};
