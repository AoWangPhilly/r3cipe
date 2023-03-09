import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { RecipeThumbnail } from "../components/RecipeThumbnail";

type RecipeThumbnailProps = {
    title: string;
    image: string;
    recipeId: string;
};

const SearchResults: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query") || "";
    const cuisine = new URLSearchParams(location.search).get("cuisine") || "";
    const pantryString =
        new URLSearchParams(location.search).get("pantry") || "";
    const mealType = new URLSearchParams(location.search).get("mealtype") || "";
    const userSubmittedString =
        new URLSearchParams(location.search).get("usersubmitted") || "";
    const [recipes, setRecipes] = useState<any>([]);

    const searchForRecipes = async () => {
        if (userSubmittedString === "true") {
            const apiResponse = await fetch(
                `/api/search/user?query=${query}&cuisine=${cuisine}&mealtype=${mealType}&pantry=${pantryString}&usersubmitted=${userSubmittedString}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (apiResponse.status === 200) {
                let data = await apiResponse.json();
                // how will the data be formatted from the api?
                //setRecipes(data.recipes);
            }
        } else {
            const spoonacularAPIResponse = await fetch(
                `/api/search/spoonacular?query=${query}&cuisine=${cuisine}&mealtype=${mealType}&pantry=${pantryString}&usersubmitted=${userSubmittedString}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (spoonacularAPIResponse.status === 200) {
                let data = await spoonacularAPIResponse.json();
                setRecipes(data.spoonacularRecipeResult.recipes);
            } else {
                await spoonacularAPIResponse.json().then((data) => {
                    console.log(data);
                });
            }
        }
    };

    // if anything in the search form changes, update the search
    useEffect(() => {
        searchForRecipes();
    }, [location]);

    return (
        <div>
            <h1>Search Results</h1>
            {
                // if there are no recipes, display a message
                recipes.length === 0 ? (
                    <Typography variant="h6">
                        No recipes found. Try a different search.
                    </Typography>
                ) : (
                    <Grid container spacing={2} sx={{
                        display: "flex",
                        margin: "auto",
                        justifyContent: "center",
                        width: "80%",
                    }}>
                        {recipes.map((recipe: RecipeThumbnailProps) => (
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <RecipeThumbnail
                                    title={recipe.title}
                                    image={recipe.image}
                                    id={recipe.recipeId}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )
            }
        </div>
    );
};

export default SearchResults;
