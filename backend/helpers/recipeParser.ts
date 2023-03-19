/**
 * Parses extremely long Spoonacular recipe object into smaller object
 * Although not used here, these follow the types defined in types.ts
 */

import { generateInstructions } from "./ai.js";

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
