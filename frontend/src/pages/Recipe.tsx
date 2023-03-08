import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeType } from "../types";
import { KATSU } from "../mockdata";
import { Button } from "@mui/material";

const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = React.useState<RecipeType>();
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const navigate = useNavigate();

    const CURRENT_USER = "1234";

    const response = {
        recipeId: id,
        recipe: KATSU,
        lastModified: new Date(),
        ownerId: "1234",
        isPublic: true,
    };
    //mock data
    useEffect(() => {
        setRecipe(response.recipe);
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
                        <div style={{ display: "flex" }}>
                            <h1>{recipe.title}</h1>
                            {
                                //if the recipe is owned by the current user, show edit button
                                response.ownerId === CURRENT_USER && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            marginLeft: "auto",
                                            height: "50px",
                                        }}
                                        onClick={() => {
                                            navigate(`/edit/${id}`);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                )
                            }
                        </div>

                        <p>Prep Time: {recipe.preparationMinutes} minutes</p>
                        <p>Cooking Time: {recipe.cookingMinutes} minutes</p>
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
