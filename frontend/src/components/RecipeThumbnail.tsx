import { RecipeType } from "../types";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface RecipeThumbnailProps {
    recipe: RecipeType;
    id: string;
}

export const RecipeThumbnail = (props: RecipeThumbnailProps) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{ maxWidth: 345 }}
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/recipe/${props.id}`);
            }}
        >
            <CardMedia
                sx={{ height: 140 }}
                image={props.recipe.image}
                title={props.recipe.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.recipe.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RecipeThumbnail;
