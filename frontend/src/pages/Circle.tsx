import React, { useState, useEffect } from "react";
import CircleSidebar from "../components/CircleSidebar";
import GroupCard from "../components/GroupCard";
import NoCircleJoined from "../components/NoCirclesJoined";

interface CircleData {
    _id: string;
    name: string;
    members: string[];
}

const Circle = () => {
    const [circles, setCircles] = useState<CircleData[]>([]);

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
                const response = await fetch("/api/circles", {
                    method: "GET",
                    credentials: "include",
                });
                console.log(response);
                if (response.ok) {
                    const { socialCircles } = await response.json();
                    setCircles(socialCircles);
                } else {
                    console.log("Error occurred while fetching circles ");
                    const errorData = await response.json();
                    console.log("Error data:", errorData);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchCircles();
    }, []);

    return (
        <div>
            <h1>Circle</h1>
            <CircleSidebar />
            {circles.length === 0 ? (
                <NoCircleJoined /> //
            ) : (
                circles.map((circle: CircleData) => (
                    <GroupCard
                        key={circle._id}
                        title={circle.name}
                        subtitle={`Members: ${circle.members.length}`}
                        avatars={avatarMembers(circle.members)}
                        code={circle._id}
                    />
                ))
            )}
        </div>
    );
};

export default Circle;
