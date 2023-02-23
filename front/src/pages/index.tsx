import { Input } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [recipeId, setRecipeId] = React.useState<string>("");

    return (
        <div>
            <h1>Home</h1>
            <Link to="/ingredients">Ingredients</Link>
            <br />
            <br />
            <Input
                placeholder="Go to recipe by ID"
                inputProps={{ "aria-label": "description" }}
                value={recipeId}
                onChange={(e) => setRecipeId(e.target.value)}
            ></Input>

            <Link to={`/recipe/${recipeId}`}>Go</Link>

            <br />
            <br />
            <br />

            <Input
                placeholder="Search for a recipe"
                inputProps={{ "aria-label": "description" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
            <Link to={`/search/${searchQuery}`}>Search</Link>

        </div>
    );
}

export default Home;
