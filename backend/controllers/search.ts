import { Request, Response } from "express";
import SpoonacularRecipe from "../models/SpoonacularRecipe.js";

const fakeRecipe = {
    recipe: {
        title: "fake pasta",
        servings: 5,
        extendedIngredients: ["basil", "pasta"],
    },
};

// TODO: parsing + caching needed
function searchSpoonacular(req: Request, res: Response) {
    
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
};

export default {
    createSpoonacularRecipe,
};
