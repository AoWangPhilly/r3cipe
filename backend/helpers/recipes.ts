import SpoonacularRecipe from "../models/SpoonacularRecipe.js";
import UserRecipe from "../models/UserRecipe.js";
import { generateInstructions } from "./ai.js";

/**
 * Parses extremely long Spoonacular recipe object into smaller object
 * Although not used here, these follow the types defined in types.ts
 */
export async function parseRecipe(recipe: any) {
    const {
        preparationMinutes,
        cookingMinutes,
        extendedIngredients,
        title,
        servings,
        image,
        imageType,
        summary,
        cuisines,
        dishTypes,
        analyzedInstructions,
        sourceUrl,
        id,
    } = recipe;

    const ingredients = extendedIngredients.map((ingredient: any) => {
        return {
            id: ingredient.id,
            original: ingredient.original,
            originalName: ingredient.originalName,
        };
    });
    const ingredientNames = ingredients.map((ingredient: any) => {
        return ingredient.originalName;
    });
    // console.log(ingredientNames);

    let instructions = analyzedInstructions;
    if (instructions && instructions.length > 0) {
        instructions = instructions[0].steps
            .map((step: any) => {
                return step.step;
            })
            .join("\n");
    } else {
        // use OpenAI to generate instructions
        console.log("Generating instructions with OpenAI");
        instructions = await generateInstructions(title, ingredientNames);
    }

    return {
        preparationMinutes: preparationMinutes,
        cookingMinutes: cookingMinutes,
        extendedIngredients: ingredients,
        title: title,
        servings: servings,
        image: image,
        imageType: imageType,
        summary: summary,
        cuisines: cuisines,
        dishTypes: dishTypes,
        instructions: instructions,
        sourceUrl: sourceUrl,
        recipeId: id,
    };
}

/**
 * Updates User/Spoonacular recipe's avgRating / numReviews
 */
export async function updateAvgRecipeRating(
    id: string,
    ratingDiff: number,
    numReviews: number
) {
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
        // console.log(recipe?.recipeId, recipe?.review);
        if (recipe) {
            recipe.review.avgRating = recipe.review.avgRating + ratingDiff;
            recipe.review.numReviews = recipe.review.numReviews + numReviews;
            recipe.markModified("review");
            await recipe.save();
            // console.log(recipe?.recipeId, recipe?.review);
        }
    }
}
