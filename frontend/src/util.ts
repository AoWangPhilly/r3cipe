import { emit } from "process";
import { RecipeType, RecipeThumbnailType } from "./types";

type RecipeResponse = {
    _id: string;
    recipeId: string;
    userId: string;
    recipe: RecipeType;
    isPublic: boolean;
    lastModified: Date;
};

type SearchResult = RecipeType & { recipeId: string };

export function convertFullRecipesToThumbnails(
    recipes: RecipeResponse[]
): RecipeThumbnailType[] {
    //if RecipeType[] is passed in, convert to RecipeResponse[]
    return recipes.map((recipe) => {
        return {
            title: recipe.recipe.title,
            image: recipe.recipe.image,
            id: recipe.recipeId,
        };
    });
}

export function convertSearchResultsToThumbnails(
    recipes: SearchResult[]
): RecipeThumbnailType[] {
    return recipes.map((recipe) => {
        return {
            title: recipe.title,
            image: recipe.image,
            id: recipe.recipeId.toString(),
        };
    });
}

export const GRADIENT = "linear-gradient(45deg, #e29f0d 40%, #f9b42c 80%)";
