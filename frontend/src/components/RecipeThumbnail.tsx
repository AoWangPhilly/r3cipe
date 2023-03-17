import { RecipeType } from "../types";
import { Avatar, Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MessageType, RecipeThumbnailType } from "../types";


interface RecipeThumbnailProps {
    recipeThumbnail: RecipeThumbnailType;
    message?: MessageType;
}

const MessageBubble = (props: { message: MessageType}) => {
    const { message } = props;
    const userInfo = message.userInfo;

    return (
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", p: 1, borderRadius: 1 }}>
            <Avatar alt={userInfo.name} src={userInfo.userImage} sx={{ width: 24, height: 24 }} />
            <Typography variant="body2" sx={{ ml: 1 }}>
                {message.message}
            </Typography>
        </Box>
    );
};

export const RecipeThumbnail = (props: RecipeThumbnailProps) => {
    const navigate = useNavigate();
    const { title, image, id } = props.recipeThumbnail;
    console.log(props);
    
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
                {props.message && (
                    <MessageBubble message={props.message} />
                )}
            </CardContent>
        </Card>
    );
};

export default RecipeThumbnail;
