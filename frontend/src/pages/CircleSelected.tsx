import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const CircleSelected: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <div>
            <h1>{id} Circle Page</h1>
        </div>
    );
};

export default CircleSelected;
