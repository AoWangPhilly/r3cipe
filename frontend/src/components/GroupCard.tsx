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
import GroupsIcon from "@mui/icons-material/Groups";
import { GRADIENT } from "../util";

interface GroupCardProps {
    title: string;
    subtitle: string;
    image: string;
    avatars: { alt: string; src: string }[];
    code: string;
}

const GroupCard: FC<GroupCardProps> = ({
    title,
    subtitle,
    avatars,
    image,
    code,
}) => {
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
                    <Avatar
                        alt={title}
                        src={image}
                        sx={{
                            width: "70px",
                            height: "70px",
                            border: "1px solid black",
                            background: GRADIENT,
                            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                                transform: "scale(1.1)",
                                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
                            },
                        }}
                    >
                        <GroupsIcon
                            sx={{
                                width: "40px",
                                height: "40px",
                            }}
                        />
                    </Avatar>
                    <CardHeader
                        title={title}
                        subheader={subtitle}
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
                    {/* <AvatarGroup max={5}>
                        {avatars.map((avatar, index) => (
                            <Avatar
                                key={index}
                                alt={avatar.alt}
                                src={avatar.src}
                                sx={{
                                    width: "40px",
                                    height: "40px",
                                    border: "3px solid black",
                                    background:
                                        GRADIENT,
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
                    </AvatarGroup> */}
                </Box>
            </Card>
        </Link>
    );
};

export default GroupCard;
