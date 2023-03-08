import { RecipeType } from "./types";

const katsu: RecipeType = {
    id: 1,
    title: "Chicken Katsu",
    image: "https://t3.ftcdn.net/jpg/03/69/57/26/360_F_369572634_6m2igusHcoqUhutoFmxtJIMgI1DsxtCt.jpg",
    imageType: "jpg",
    extendedIngredients: [
        {
            id: 1,
            original: "1 cup of milk",
            originalName: "milk",
        },
        {
            id: 2,
            original: "1 cup of flour",
            originalName: "flour",
        },
    ],
    preparationMinutes: 10,
    cookingMinutes: 20,
    sourceUrl: "google.com",
    instructions: "Mix the milk and flour. Fry the chicken. Eat",
    servings: 4,
    cuisines: ["test"],
    dishTypes: ["test"],
    summary: "Chicken Katsu the way my grandma makes it",
};

const manyKatsu: RecipeType[] = [];
for (let i = 0; i < 100; i++) {
    manyKatsu.push({
        ...katsu,
        id: i,
    });
}

export const KATSU = katsu;
export const MANY_KATSU = manyKatsu;