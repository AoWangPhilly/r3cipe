import { FC } from "react";
import {
    Card,
    CardHeader,
    Avatar,
    AvatarGroup,
    Grid,
    Box,
} from "@mui/material";
import { Link } from "react-router-dom";

interface GroupCardProps {
    title: string;
    subtitle: string;
    avatars: { alt: string; src: string }[];
    code: string;
}

const GroupCard: FC<GroupCardProps> = ({ title, subtitle, avatars, code }) => {
    return (
        <Link to={`/circle/${code}`} style={{ textDecoration: "none" }}>
            <Card
                sx={{
                    width: "65%",
                    overflow: "hidden",
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease-in-out",

                    "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        mb: 2,
                    }}
                >
                    <CardHeader
                        title={title}
                        subheader={subtitle}
                        avatar={
                            <AvatarGroup max={5}>
                                {avatars.map((avatar, index) => (
                                    <Avatar
                                        key={index}
                                        alt={avatar.alt}
                                        src={avatar.src}
                                        sx={{
                                            width: "70px",
                                            height: "70px",
                                            border: "3px solid black",
                                            background:
                                                "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                                            boxShadow:
                                                "0px 0px 20px rgba(0, 0, 0, 0.2)",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                                boxShadow:
                                                    "0px 0px 20px rgba(0, 0, 0, 0.4)",
                                            },
                                        }}
                                    />
                                ))}
                            </AvatarGroup>
                        }
                        sx={{
                            backgroundColor: "transparent",
                            textAlign: "center",
                            color: "#444444",
                            "& .MuiCardHeader-title": {
                                fontSize: "2rem",
                                fontWeight: "bold",
                            },
                            "& .MuiCardHeader-subheader": {
                                fontSize: "1.5rem",
                                fontWeight: "lighter",
                            },
                        }}
                    />
                </Box>
            </Card>
        </Link>
    );
};

export default GroupCard;
