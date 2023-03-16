import {
    Grid,
    Box,
    Avatar,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoinCircleModal from "../components/JoinCircleModal";
import RecipeThumbnail from "../components/RecipeThumbnail";

interface CircleData {
    ownerId: string;
    description?: string;
    members: string[];
    posts: string[];
    name: string;
    profileUrl: string;
}

const CircleSelected = () => {
    const { id } = useParams<{ id: string }>();
    const [circleData, setCircleData] = useState<CircleData>({
        ownerId: "",
        members: [],
        posts: [],
        name: "",
        profileUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [joinCircleModalOpen, setJoinCircleModalOpen] = useState(false);

    const handleJoinCircleModalOpen = () => {
        setJoinCircleModalOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/circles/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                console.log(response);

                if (response.ok) {
                    const { socialCircle } = await response.json();
                    setCircleData(socialCircle);
                } else if (response.status === 401) {
                    handleJoinCircleModalOpen();
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
        <Grid container spacing={4}>
            {/* Left Side of Page */}
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
                        src={circleData.profileUrl}
                        sx={{
                            width: "150px",
                            height: "150px",
                            marginBottom: "10px",
                        }}
                    />
                    <Typography variant="h5" gutterBottom>
                        Group Name: {circleData.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Description: {circleData.description}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Owner: {circleData.ownerId}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
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
                    <Typography variant="h5" gutterBottom>
                        Posts
                    </Typography>
                    {
                        // if there are no posts, display a message
                        circleData.posts.length === 0 ? (
                            <Typography variant="h6">No posts found</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {circleData.posts.map((post: any) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        key={post.recipeId}
                                    >
                                        <RecipeThumbnail
                                            recipeThumbnail={
                                                post.recipeThumbnail
                                            }
                                            message={post.message}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    }
                </Box>
            </Grid>
        </Grid>
        <JoinCircleModal 
            joinCircleModalOpen={joinCircleModalOpen}
            circleId={id!}
        />
        </>
    );
};

export default CircleSelected;
