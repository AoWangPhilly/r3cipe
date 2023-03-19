import RecipeThumbnail from "../components/RecipeThumbnail";
import {
    Tabs,
    Tab,
    Grid,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RecipeThumbnailType } from "../types";
import { convertFullRecipesToThumbnails } from "../util";

type LibraryTab = "favorites" | "recipes";

export const Library = () => {
    const [activeTab, setActiveTab] = useState<LibraryTab>("favorites");
    const [recipes, setRecipes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const handleTabChange = (
        event: React.SyntheticEvent,
        newValue: LibraryTab
    ) => {
        setActiveTab(newValue);
    };

    const requestFavoritesFromBackend = async () => {
        await fetch("/api/user/inventory/favorite", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setRecipes(convertFullRecipesToThumbnails(data));
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const requestUsersRecipesFromBackend = async () => {
        await fetch("/api/user/inventory/myrecipes", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setRecipes(convertFullRecipesToThumbnails(data));
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
    };

    useEffect(() => {
        if (activeTab === "favorites") {
            requestFavoritesFromBackend();
        } else {
            requestUsersRecipesFromBackend();
        }
    }, [activeTab]);

    if (loading) {
        return <CircularProgress />;
    } else if (error) {
        return <div>error</div>;
    } else if (!recipes) {
        return <div>No recipes found</div>;
    }
    return (
        <Box sx={{ width: "100%" }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="My Favorites" value="favorites" />
                <Tab label="My Recipes" value="recipes" />
            </Tabs>
            {recipes && recipes.length > 0 ? (
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
                    {recipes.map((recipe: RecipeThumbnailType) => (
                        <Grid item xs={1} key={recipe.id}>
                            <RecipeThumbnail recipeThumbnail={recipe} />
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
