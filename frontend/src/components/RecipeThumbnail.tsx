import { RecipeType } from "../types";
import { Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MessageType, RecipeThumbnailType } from "../types";


interface RecipeThumbnailProps {
    recipeThumbnail: RecipeThumbnailType;
    message?: MessageType;
}

export const RecipeThumbnail = (props: RecipeThumbnailProps) => {
    const navigate = useNavigate();
    const { title, image, id } = props.recipeThumbnail;
    console.log(props);
    if(props.message) {
        const { userInfo, message, timestamp } = props.message;
    }
    const isUserRecipe = id.startsWith("u");

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
                {isUserRecipe && (
                    <Chip label="User Submitted" color="primary" />
                )}
            </CardContent>
        </Card>
    );
};

export default RecipeThumbnail;
