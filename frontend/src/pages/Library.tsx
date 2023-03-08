import { Grid } from "@mui/material";
import RecipeThumbnail from "../components/RecipeThumbnail";
import { RecipeType } from "../types";
import { KATSU, MANY_KATSU } from "../mockdata";

export const Library = () => {
    const favorites = [
        {
            id: "1",
            recipe: KATSU,
        },
        {
            id: "2",
            recipe: KATSU,
        },
    ];

    return (
        <div>
            <h1>Library</h1>
            <h2>My Favorites</h2>
            <Grid
                container
                direction="row"
                gap={5}
                columns={5}
                gridAutoRows="auto"
                justifyContent="center"
                alignItems="center"
            >
                {favorites.map((recipe) => (
                    <Grid item xs={1} key={recipe.id}>
                        <RecipeThumbnail recipe={recipe.recipe} id={recipe.id} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Library;
