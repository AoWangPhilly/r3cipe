import {
    Grid,
    Box,
    Avatar,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeThumbnail from "../components/RecipeThumbnail";

interface CircleData {
    name: string;
    description: string;
    imageUrl: string;
    owner: string;
    members: string[];
    recipes: any[];
}

type RecipeThumbnailProps = {
    title: string;
    image: string;
    id: string;
};

const CircleSelected = () => {
    const { id } = useParams<{ id: string }>();
    const [circleData, setCircleData] = useState<CircleData>({
        name: "",
        description: "",
        imageUrl: "",
        owner: "",
        members: [],
        recipes: [],
    });

    useEffect(() => {
        fetch(`/api/circle/${id}`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((result) => {
                setCircleData(result);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    return (
        <Grid container>
            {/* Left Side  of page*/}
            <Grid item xs={12} md={4}>
                <Box
                    sx={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <Avatar
                        src={circleData.imageUrl}
                        sx={{
                            width: "150px",
                            height: "150px",
                            marginBottom: "10px",
                        }}
                    ></Avatar>
                    <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                        Group Name: {circleData.name}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                        Description: {circleData.description}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                        Owner: {circleData.owner}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                        Members:
                    </Typography>
                    <List sx={{ width: "100%" }}>
                        {circleData.members.map((member) => (
                            <ListItem key={member}>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText primary={member} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Grid>

            {/* Right Side of Page */}
            <Grid item xs={12} md={8}>
                <Box
                    sx={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                        Posts
                    </Typography>
                    {
                        // if there are no posts, display a message
                        circleData.recipes.length === 0 ? (
                            <Typography variant="h6">No posts found</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {circleData.recipes.map(
                                    (recipe: RecipeThumbnailProps) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <RecipeThumbnail
                                                title={recipe.title}
                                                image={recipe.image}
                                                id={recipe.id}
                                            />
                                        </Grid>
                                    )
                                )}
                            </Grid>
                        )
                        // to do add some sort of chat feature to the recipe page
                    }
                </Box>
            </Grid>
        </Grid>
    );
};

export default CircleSelected;
