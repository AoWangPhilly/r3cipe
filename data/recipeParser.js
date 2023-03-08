import recipes from "./test.json" assert { type: "json" };

function parseRecipes(recipe) {
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

    const instructions = analyzedInstructions[0].steps
        .map((step) => {
            return step.step;
        })
        .join("\n");

    const ingredients = extendedIngredients.map((ingredient) => {
        return {
            id: ingredient.id,
            original: ingredient.original,
            originalName: ingredient.originalName,
        };
    });

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

console.log(parseRecipes(recipes.results[0]));
