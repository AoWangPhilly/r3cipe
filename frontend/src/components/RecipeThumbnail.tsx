import { RecipeType } from "../types";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface RecipeThumbnailProps {
    title: string;
    image: string;
    id: string;
}

export const RecipeThumbnail = (props: RecipeThumbnailProps) => {
    const navigate = useNavigate();
    const { title, image, id } = props;

    return (
        <Card
            sx={{ maxWidth: 345 }}
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/recipe/${id}`);
            }}
        >
            <CardMedia
                sx={{ height: 140 }}
                image={image}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RecipeThumbnail;
