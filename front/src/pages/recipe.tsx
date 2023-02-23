import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { RecipeType } from "../types";

const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = React.useState<RecipeType>();
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    let myPantry = ["1001", "11215", "1102047", "11291"];

    useEffect(() => {
        fetch(`http://localhost:3000/api/recipe/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setRecipe(data);
                setIsLoaded(true);
            })
            .catch((error) => {
                setError(error);
                setIsLoaded(true);
            });
    }, []);

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
                        <h2>Ingredients</h2>
                        <ul>
                            {recipe.extendedIngredients.map((ingredient) => (
                                //color the ingredients that are in the pantry
                                <li key={ingredient.id}>
                                    {myPantry.includes(
                                        ingredient.id.toString()
                                    ) ? (
                                        <span style={{ color: "green" }}>
                                            {ingredient.original}
                                        </span>
                                    ) : (
                                        <span style={{ color: "orange" }}>
                                            {ingredient.original}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <p>Ready in {recipe.readyInMinutes} minutes</p>
                        <p>Yields {recipe.servings} Servings</p>
                        <p>
                            {" "}
                            Source:
                            <a href={recipe.sourceUrl}>{recipe.sourceName}</a>
                        </p>
                        <h2>Instructions</h2>
                        <ol>
                            {recipe.instructions ? (
                                recipe.instructions.split(".").map((step) => (
                                    <li key={step}>{step}</li>
                                ))
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
