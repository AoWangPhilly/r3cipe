export function parseRecipes(recipe: any) {
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
        .map((step: any) => {
            return step.step;
        })
        .join("\n");
    return {
        preparationMinutes: preparationMinutes,
        cookingMinutes: cookingMinutes,
        extendedIngredients: extendedIngredients,
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
