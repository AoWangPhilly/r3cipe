//This is the type that we will reduce the API response to. We will only use the data we need.
//When users are creating their recipe, we will ask them for this data.
export interface RecipeType {
    preparationMinutes: number; // The number of minutes it takes to prepare the recipe
    cookingMinutes: number; // The number of minutes it takes to cook the recipe
    extendedIngredients: Ingredient[];
    id: number; // spoonacular id 1234 OR user id u1234
    title: string; // The title of the recipe
    servings: number; // How many servings does this recipe yield
    image: string; //link to image
    imageType: string; // image type (jpg, png, etc)
    summary: string; // A short summary of the recipe
    cuisines: any[]; // An array of strings of the cuisines the recipe belongs to "italian", "mexican", etc
    dishTypes: string[]; // An array of strings of the dish types the recipe belongs to "main course", "side dish", etc
    instructions: string; // The instructions on how to make the recipe
    sourceUrl: string; // Optional link to the source of the recipe
}

export interface Ingredient {
    id: number; // 1123
    original: string; // "1 cup of milk"
    originalName: string; // "milk"
}

//This is the response of the /complexSearch endpoint
export interface SearchResultResponse {
    offset: number;
    number: number;
    results: RawRecipeType[];
    totalResults: number;
}

//This is the recipe type that we get from the API. We will use this to create our RecipeType
interface RawRecipeType {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    veryHealthy: boolean;
    cheap: boolean;
    veryPopular: boolean;
    sustainable: boolean;
    lowFodmap: boolean;
    weightWatcherSmartPoints: number;
    gaps: string;
    preparationMinutes: number;
    cookingMinutes: number;
    aggregateLikes: number;
    healthScore: number;
    creditsText: string;
    license: string;
    sourceName: string;
    pricePerServing: number;
    // extendedIngredients: ExtendedIngredient[];
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    sourceUrl: string;
    image: string;
    imageType: string;
    summary: string;
    cuisines: any[];
    dishTypes: string[];
    diets: any[];
    occasions: any[];
    // winePairing: WinePairing;
    instructions: string;
    analyzedInstructions: any[];
    originalId: null;
    spoonacularSourceUrl: string;
}