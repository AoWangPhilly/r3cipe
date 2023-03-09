import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeType } from "../types";
import { KATSU } from "../mockdata";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { stripHtml } from "string-strip-html";
import { AuthContext } from "../context/AuthContext";

const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuth } = useContext(AuthContext);
    const [recipe, setRecipe] = React.useState<RecipeType>();
    const [owner, setOwner] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [isLoaded, setIsLoaded] = React.useState(false);
    const navigate = useNavigate();

    const CURRENT_USER = "Spoonacular";

    // const response = {
    //     recipeId: id,
    //     recipe: KATSU,
    //     lastModified: new Date(),
    //     ownerId: "1234",
    //     isPublic: true,
    // };
    //mock data
    useEffect(() => {
        //fetch recipe from backend
        fetch(`/api/search/recipe/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setRecipe(result.recipe.recipe);
                    setOwner(result.recipe.ownerId);
                    setIsLoaded(true);
                },
                (error) => {
                    setError(error);
                    setIsLoaded(true);
                }
            );
    }, [id]);

    useEffect(() => {
        if (isAuth) {
            fetch(`/api/user/inventory/pantry`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        console.log(result);
                    },
                    (error) => {
                        setError(error);
                    }
                );
        }
    }, [isAuth]);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {recipe && (
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            margin: "auto",
                            width: "80%",
                            marginTop: "2rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <Grid item xs={12}>
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                            >
                                {recipe.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Avatar
                                alt={recipe.title}
                                src={recipe.image}
                                variant="square"
                                style={{ width: "60%", height: "100%", margin: "auto" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {recipe.preparationMinutes > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Prep Time: </b>
                                    {recipe.preparationMinutes} minutes
                                </Typography>
                            )}
                            {recipe.cookingMinutes > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Cook Time: </b>
                                    {recipe.cookingMinutes} minutes
                                </Typography>
                            )}
                            <Typography variant="subtitle1">
                                <b>Servings: </b>
                                {recipe.servings}
                            </Typography>
                            {recipe.cuisines.length > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Cuisines: </b>
                                    {recipe.cuisines.join(", ")}
                                </Typography>
                            )}
                            {recipe.dishTypes.length > 0 && (
                                <Typography variant="subtitle1">
                                    <b>Dish Type: </b>
                                    {recipe.dishTypes.join(", ")}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                variant="body1"
                                align="justify"
                                gutterBottom
                            >
                                {stripHtml(recipe.summary).result}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Ingredients:
                            </Typography>
                            <ul>
                                {recipe.extendedIngredients.map(
                                    (ingredient) => (
                                        <li key={ingredient.id}>
                                            {ingredient.original}
                                        </li>
                                    )
                                )}
                            </ul>
                        </Grid>
                        {recipe.instructions && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Instructions:
                                </Typography>
                                <ol>
                                    {recipe.instructions
                                        .split(".")
                                        .filter((step) => step !== "")
                                        .map((step) => (
                                            <li key={step}>{step}</li>
                                        ))}
                                </ol>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                Source URL:{" "}
                                <a
                                    href={recipe.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {recipe.sourceUrl}
                                </a>
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </>
        );
    }
};

export default Recipe;
