import { FC } from "react";
import { Card, CardHeader, Avatar, Grid } from "@mui/material";

interface GroupCardProps {
    title: string;
    subtitle: string;
    avatars: { alt: string; src: string }[];
}
const GroupCard: FC<GroupCardProps> = ({ title, subtitle, avatars }) => {
    return (
        <Card>
            <CardHeader
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
    );
};

export default GroupCard;
