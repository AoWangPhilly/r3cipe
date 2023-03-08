import RecipeThumbnail from "../components/RecipeThumbnail";
import {
    Tabs,
    Tab,
    Grid,
    Box,
    Typography,
    makeStyles,
    createStyles,
    Theme,
} from "@mui/material";
import { useState } from "react";

type LibraryTab = "favorites" | "recipes";

const requestFavoritesFromBackend = async () => {
    await fetch("/api/inventory/favorites", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
};

const requestUsersRecipesFromBackend = async () => {
    await fetch("/api/inventory/usersrecipes", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
};

const sampleFavoritesResponse = [
    {
        id: "156",
        title: "Pasta",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    },
    {
        id: "24",
        title: "Pasta 2",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    },
    {
        id: "u32",
        title: "Abe's Pasta",
        image: "https://cdn.spoonacular2.com/asdasdasdasdasasda",
    },
    {
        id: "u324",
        title: "big pasta",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    },
    {
        id: "u325",
        title: "Pasta",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    },

];

const sampleUsersRecipesResponse = [
    {
        id: "u156",
        title: "Pasta",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    },
    {
        id: "u24",
        title: "Pasta 2",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    },
    {
        id: "u32",
        title: "My Pasta",
        image: "https://cdn.spoonacular2.com/asdasdasdasdasasda",
    },
];

export const Library = () => {
    const [activeTab, setActiveTab] = useState<LibraryTab>("favorites");

    const handleTabChange = (
        event: React.SyntheticEvent,
        newValue: LibraryTab
    ) => {
        setActiveTab(newValue);
    };

    const recipes =
        activeTab === "favorites"
            ? sampleFavoritesResponse
            : sampleUsersRecipesResponse;

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="My Favorites" value="favorites" />
                <Tab label="My Recipes" value="recipes" />
            </Tabs>
            {recipes.length > 0 ? (
                <Grid
                    container
                    direction="row"
                    gap={5}
                    columns={5}
                    gridAutoRows="auto"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        margin: 2,
                    }}
                >
                    {recipes.map((recipe) => (
                        <Grid item xs={1} key={recipe.id}>
                            <RecipeThumbnail
                                title={recipe.title}
                                id={recipe.id}
                                image={recipe.image}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 200,
                    }}
                >
                    <Typography variant="h6">No recipes found</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Library;
