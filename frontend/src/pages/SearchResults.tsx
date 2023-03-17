import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { RecipeThumbnail } from "../components/RecipeThumbnail";
import { RecipeThumbnailType } from "../types";
import {
    convertFullRecipesToThumbnails,
    convertSearchResultsToThumbnails,
} from "../util";

const SearchResults: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query") || "";
    const cuisine = new URLSearchParams(location.search).get("cuisine") || "";
    const pantryString =
        new URLSearchParams(location.search).get("pantry") || "";
    const mealType = new URLSearchParams(location.search).get("mealtype") || "";
    const userSubmittedString =
        new URLSearchParams(location.search).get("usersubmitted") || "";
    const feelingHungry =
        new URLSearchParams(location.search).get("feelinghungry") || "";

    const [recipes, setRecipes] = useState<any>([]); // TODO?: could use RecipeType
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);

    const searchForRecipes = async () => {
        if (feelingHungry === "true") {
            const apiResponse = await fetch(`/api/search/spoonacular/random`, {
                method: "GET",
                credentials: "include",
            });
            if (apiResponse.status === 200) {
                let data = await apiResponse.json();
                console.log(data);
                setRecipes(
                    convertSearchResultsToThumbnails(data.randomRecipeList)
                );
            }
            return;
        }

        if (userSubmittedString === "true") {
            const apiResponse = await fetch(
                `/api/user/recipes?query=${query}&cuisine=${cuisine}&mealtype=${mealType}&pantry=${pantryString}&usersubmitted=${userSubmittedString}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (apiResponse.status === 200) {
                let data = await apiResponse.json();
                setRecipes(convertFullRecipesToThumbnails(data.recipes));
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
                setRecipes(
                    convertSearchResultsToThumbnails(
                        data.spoonacularRecipeResult.recipes
                    )
                );
                setOffset(data.spoonacularRecipeResult.recipes.length);
            } else {
                await spoonacularAPIResponse.json().then((data) => {
                    console.log(data);
                });
            }
        }
    };

    // if anything in the search form changes, update the search
    useEffect(() => {
        searchForRecipes().then(() => {
            setLoading(false);
        });
    }, [location]);

    const handleGetMoreRecipes = async () => {
        const spoonacularAPIResponse = await fetch(
            `/api/search/spoonacular?query=${query}&cuisine=${cuisine}&mealtype=${mealType}&pantry=${pantryString}&usersubmitted=${userSubmittedString}&offset=${recipes.length}`,
            {
                method: "GET",
                credentials: "include",
            }
        );
        if (spoonacularAPIResponse.status === 200) {
            let data = await spoonacularAPIResponse.json();
            setRecipes([
                ...recipes,
                ...convertSearchResultsToThumbnails(
                    data.spoonacularRecipeResult.recipes
                ),
            ]);
            setOffset(offset + data.spoonacularRecipeResult.recipes.length);
        } else {
            await spoonacularAPIResponse.json().then((data) => {
                console.log(data);
            });
        }
    };

    if (loading) return <> </>;
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
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            display: "flex",
                            margin: "auto",
                            justifyContent: "center",
                            width: "80%",
                        }}
                    >
                        {recipes.map((recipe: RecipeThumbnailType) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={recipe.id}
                            >
                                <RecipeThumbnail recipeThumbnail={recipe} />
                            </Grid>
                        ))}
                    </Grid>
                )
            }
            {offset % 16 === 0 && (
                <Button
                    // center
                    sx={{
                        display: "flex",
                        margin: "auto",
                        justifyContent: "center",
                        width: "40%",
                        height: "50px",
                        marginBottom: "100px",
                        marginTop: "50px",
                    }}
                    variant="contained"
                    onClick={handleGetMoreRecipes}
                >
                    Get More Recipes
                </Button>
            )}
        </div>
    );
};

export default SearchResults;
