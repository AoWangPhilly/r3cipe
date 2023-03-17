// this Object is sent to the client for AuthContext purposes
export interface UserInfo {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    expiry: Date;
}

export type ErrorMsg = { errors: string[] };

/**
 * Spoonacular/User Recipe Types
 */
//This is the type that we will reduce the API response to. We will only use the data we need.
//When users are creating their recipe, we will ask them for this data.
export interface RecipeType {
    preparationMinutes: number; // The number of minutes it takes to prepare the recipe
    cookingMinutes: number; // The number of minutes it takes to cook the recipe
    extendedIngredients: Ingredient[];
    title: string; // The title of the recipe
    servings: number; // How many servings does this recipe yield
    image: string; //link to image
    imageType: string; // image type (jpg, png, etc)
    summary: string; // A short summary of the recipe
    cuisines: Cuisine[]; // An array of strings of the cuisines the recipe belongs to "italian", "mexican", etc
    dishTypes: DishType[]; // An array of strings of the dish types the recipe belongs to "main course", "side dish", etc
    instructions: string; // The instructions on how to make the recipe
    sourceUrl: string; // Optional link to the source of the recipe
}

export type RecipeTypeWithId = RecipeType & { recipeId: string };
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
export interface RawRecipeType {
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

export const CUISINES = [
    "African",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese",
];

export type Cuisine = typeof CUISINES[number];

export const DISH_TYPES = [
    "main course",
    "side dish",
    "dessert",
    "appetizer",
    "salad",
    "bread",
    "breakfast",
    "soup",
    "beverage",
    "sauce",
    "marinade",
    "fingerfood",
    "snack",
    "drink",
];

export type DishType = typeof DISH_TYPES[number];

export interface FiltUserInfo {
    name: string;
    userId: string;
    userImage: string;
}

export interface MessageType {
    // _id: string; // TODO: this is unncecessary
    userInfo: FiltUserInfo;
    message: string;
    timestamp: Date;
}

export interface RecipeThumbnailType {
    title: string;
    image: string;
    id: string;
}
export type PostType = {
    message: MessageType;
    recipeThumbnail: RecipeThumbnailType;
};

export type PostList = {
    userInfo: FiltUserInfo;
    message: string;
    recipeThumbnail: RecipeThumbnailType;
    timestamp: Date;
}
// e.g.
/* {
    "message": {
        "_id": "5f9f1b0b0b9b9b0017a1b0b9",
        "userInfo": {
            "name": "John Doe",
            "userId": "5f9f1b0b0b9b9b0017a1b0b9",
            "userImage": "https://i.imgur.com/4KeKvtH.jpg"
        },
        "message": "Check out this recipe!",
       "timestamp": "2020-10-30T23:00:00.000Z"
    },
    "recipeThumbnail": {
        "title": "Chicken Parmesan",
        "image": "https://spoonacular.com/recipeImages/715538-556x370.jpg",
        "id": "715538"
    }
} */
