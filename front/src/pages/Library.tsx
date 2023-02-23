import { Grid } from "@mui/material";
import RecipeThumbnail from "../components/RecipeThumbnail";
import { RecipeType } from "../types";
import { MANY_KATSU } from "../mockdata";

export const Library = () => {

    const favorites = MANY_KATSU;

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
                    <Grid item xs={1}>
                        <RecipeThumbnail recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Library;
