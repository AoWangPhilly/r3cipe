import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CircleSidebar from "../components/CircleSidebar";
import GroupCard from "../components/GroupCard";
import NoCircleJoined from "../components/NoCirclesJoined";
import { Box, Typography } from "@mui/material";

interface CircleData {
    _id: string;
    name: string;
    members: string[];
    profileUrl: string;
}

const Circle = () => {
    const [circles, setCircles] = useState<CircleData[]>([]);
    const [loading, setLoading] = useState(true);
    //  this is to convert the members array to the format that GroupCard expects
    // api curently returns an array of strings for members and not an array of objects with alt(name) and src(picture)
    const avatarMembers = (members: string[]) => {
        return members.map((member) => ({
            alt: member,
            src: "",
        }));
    };

    useEffect(() => {
        const fetchCircles = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/circles", {
                    method: "GET",
                    credentials: "include",
                });
                // console.log(response);
                if (response.ok) {
                    const { socialCircles } = await response.json();
                    setCircles(socialCircles);
                } else {
                    // console.log("Error occurred while fetching circles ");
                    const errorData = await response.json();
                    // console.log("Error data:", errorData);
                    console.error(errorData);
                }
            } catch (error) {
                console.log(error);
                
            }
            setLoading(false);
        };

        fetchCircles();
    }, []);

    if (loading) {
        return (
            <div>
                <h1>Circle</h1>
                <CircleSidebar />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </div>
            </div>
        );
    }

    return (
        <>
            <Typography variant="h4">Circles</Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    width: "40%",
                }}
            >
                <CircleSidebar />
                {circles.length === 0 ? (
                    <NoCircleJoined /> //
                ) : (
                    circles.map((circle: CircleData) => (
                        <GroupCard
                            key={circle._id}
                            title={circle.name}
                            subtitle={`Members: ${circle.members.length}`}
                            image={circle.profileUrl}
                            avatars={avatarMembers(circle.members)}
                            code={circle._id}
                        />
                    ))
                )}
            </Box>
        </>
    );
};

export default Circle;
