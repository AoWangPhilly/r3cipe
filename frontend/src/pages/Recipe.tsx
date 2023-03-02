import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { RecipeType } from "../types";

const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = React.useState<RecipeType>();
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    //mock data
    useEffect(() => {
        setRecipe({
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
        });
        setIsLoaded(true);
    }, []);

    // useEffect(() => {
    //     axios
    //         .get(`/api/recipe/${id}`)
    //         .then((response) => {
    //             setRecipe(response.data);
    //             setIsLoaded(true);
    //         })
    //         .catch((error) => {
    //             setError(error);
    //             setIsLoaded(true);
    //         });
    // }, []);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                {recipe && (
                    <div>
                        <h1>{recipe.title}</h1>
                        <img src={recipe.image} alt={recipe.title} />
                        <p>{recipe.summary}</p>
                        <h3>Ingredients</h3>
                        <ul>
                            {recipe.extendedIngredients.map((ingredient) => (
                                //color the ingredients that are in the pantry
                                <li key={ingredient.id}>
                                    <span style={{ color: "orange" }}>
                                        {ingredient.original}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p>Prep Time: {recipe.preparationMinutes} minutes</p>
                        <p>Cooking Time: {recipe.cookingMinutes} minutes</p>

                        <p>
                            {" "}
                            Source:
                            <a href={recipe.sourceUrl}>Source</a>
                        </p>
                        <h2>Instructions</h2>
                        <ol>
                            {recipe.instructions ? (
                                recipe.instructions
                                    .split(".")
                                    .map((step) => <li key={step}>{step}</li>)
                            ) : (
                                <li>Instructions not available</li>
                            )}
                        </ol>
                    </div>
                )}
            </div>
        );
    }
};

export default Recipe;
