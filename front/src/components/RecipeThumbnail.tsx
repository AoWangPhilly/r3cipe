import { RecipeType } from "../types";
import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface RecipeThumbnailProps {
    recipe: RecipeType;
}


export const RecipeThumbnail = (props: RecipeThumbnailProps) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 345 }} onClick={() => {
            navigate(`/recipe/${props.recipe.id}`)
        }}>
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
