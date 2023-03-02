import { FC } from "react";
import { Card, CardHeader, Avatar, Grid } from "@mui/material";
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
                    width: "70%",
                    mb: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        backgroundColor: "#grey",
                        boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <CardHeader
                    code={code}
                    title={title}
                    subheader={subtitle}
                    avatar={
                        <Grid container spacing={2}>
                            {avatars.map((avatar, index) => (
                                <Grid item key={index}>
                                    <Avatar
                                        alt={avatar.alt}
                                        src={avatar.src}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            background:
                                                "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                                        }}
                                    ></Avatar>
                                </Grid>
                            ))}
                        </Grid>
                    }
                />
            </Card>
        </Link>
    );
};

export default GroupCard;
