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
    IconButton,
    Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoinCircleModal from "../components/JoinCircleModal";
import RecipeThumbnail from "../components/RecipeThumbnail";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import StarIcon from "@mui/icons-material/Star";
import TrashIcon from "@mui/icons-material/Delete";
import GroupsIcon from "@mui/icons-material/Groups";
import { GRADIENT } from "../util";
import { AuthContext } from "../context/AuthContext";
import DeleteCircleModal from "../components/DeleteCircleModal";
import LeaveCircleModal from "../components/LeaveCircleModal";
import KickCircleModal from "../components/KickCircleModal";

interface CircleData {
    _id: string;
    name: string;
    description: string;
    profileUrl: string;
    owner: {
        _id: string;
        name: string;
        profileUrl: string;
    };
    members: {
        _id: string;
        name: string;
        profileUrl: string;
    }[];
    posts: {}[];
}

const CircleSelected = () => {
    const { id } = useParams<{ id: string }>();
    const [circleData, setCircleData] = useState<CircleData>({
        _id: "",
        name: "",
        description: "",
        profileUrl: "",
        owner: {
            _id: "",
            name: "",
            profileUrl: "",
        },
        members: [],
        posts: [{}],
    });
    const [loading, setLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const [joinCircleModalOpen, setJoinCircleModalOpen] = useState(false);
    const [deleteCircleModalOpen, setDeleteCircleModalOpen] = useState(false);
    const [leaveCircleModalOpen, setLeaveCircleModalOpen] = useState(false);
    const [kickCircleModalOpen, setKickCircleModalOpen] = useState(false);
    const [userToBeKicked, setUserToBeKicked] = useState({
        _id: "",
        name: "",
    });
    const { userId } = useContext(AuthContext);

    const handleJoinCircleModalOpen = () => {
        setJoinCircleModalOpen(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(id!);
        setIsCopied(true);
    };

    const handleKickMember = (memberId: string, memberName: string) => {
        setUserToBeKicked({
            _id: memberId,
            name: memberName,
        });
        setKickCircleModalOpen(true);
    };

    const handleLeaveCircle = () => {
        setLeaveCircleModalOpen(true);
    };

    const handleDeleteCircle = () => {
        setDeleteCircleModalOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/circles/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const { socialCircle } = await response.json();
                    setCircleData(socialCircle);
                    const response2 = await fetch(`/api/circles/${id}/posts`, {
                        method: "GET",
                        credentials: "include",
                    });
                    const { posts } = await response2.json();
                    setCircleData((prev) => ({
                        ...prev,
                        posts,
                    }));
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
                    <Tooltip
                        title={
                            isCopied ? "Invite code copied!" : "Copy code to clipboard"
                        }
                    >
                        <IconButton onClick={handleCopyLink} size="large">
                            Invite
                            <FileCopyIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title={
                            // if the user is the owner, display a message
                            circleData.owner._id === userId
                                ? "Delete Circle"
                                : "Leave Circle"
                        }
                    >
                        <IconButton
                            onClick={() => {
                                if (circleData.owner._id === userId) {
                                    handleDeleteCircle();
                                } else {
                                    handleLeaveCircle();
                                }
                            }}
                            size="large"
                        >
                            {circleData.owner._id === userId
                                ? "Delete"
                                : "Leave"}
                            <TrashIcon />
                        </IconButton>
                    </Tooltip>

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
                                border: "1px solid black",
                                background: GRADIENT,
                            }}
                        >
                            <GroupsIcon
                                sx={{
                                    width: "100px",
                                    height: "100px",
                                }}
                            />
                        </Avatar>
                        <Typography variant="h5" gutterBottom>
                            {circleData.name}
                        </Typography>

                        <Typography variant="body1" gutterBottom>
                            {circleData.description}
                        </Typography>

                        <List sx={{ width: "40%" }}>
                            {circleData.members.map((member) => (
                                <ListItem key={member._id}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={member.profileUrl}
                                            sx={{
                                                width: "50px",
                                                height: "50px",
                                                background: GRADIENT,
                                            }}
                                        />
                                    </ListItemAvatar>

                                    <ListItemText primary={member.name} />
                                    {member._id === circleData.owner._id && (
                                        <Tooltip title="Owner">
                                            <StarIcon
                                                sx={{
                                                    color: "gold",
                                                    marginRight: "8px",
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                    {userId === circleData.owner._id &&
                                        userId !== member._id && (
                                            <Tooltip title="Kick Member">
                                                <IconButton
                                                    onClick={() =>
                                                        handleKickMember(
                                                            member._id,
                                                            member.name
                                                        )
                                                    }
                                                >
                                                    <TrashIcon
                                                        sx={{
                                                            color: "red",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        )}
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
                            !circleData.posts ? (
                                <Typography variant="h6">
                                    No posts found
                                </Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {circleData.posts
                                        .slice(0)
                                        .reverse()
                                        .map((post: any) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={6}
                                                lg={4}
                                                key={post.recipeId}
                                            >
                                                <RecipeThumbnail
                                                    recipeThumbnail={
                                                        post.recipeThumbnail
                                                    }
                                                    message={{
                                                        message: post.message,
                                                        userInfo: post.userInfo,
                                                        timestamp:
                                                            post.timestamp,
                                                    }}
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
            <DeleteCircleModal
                deleteCircleModalOpen={deleteCircleModalOpen}
                setDeleteCircleModalOpen={setDeleteCircleModalOpen}
                circleId={id!}
            />
            <LeaveCircleModal
                leaveCircleModalOpen={leaveCircleModalOpen}
                setLeaveCircleModalOpen={setLeaveCircleModalOpen}
                circleId={id!}
            />
            {userToBeKicked && (
                <KickCircleModal
                    kickCircleModalOpen={kickCircleModalOpen}
                    setKickCircleModalOpen={setKickCircleModalOpen}
                    circleId={id!}
                    user={userToBeKicked}
                />
            )}
        </>
    );
};

export default CircleSelected;
