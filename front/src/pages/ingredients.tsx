import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

interface Ingredient {
    id: string;
    name: string;
}


function Ingredients() {
    //api call to localhost:3000/api/ingredients
    const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // MealDB API
    // useEffect(() => {
    //     fetch("http://localhost:3000/api/ingredients")
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log(data);
    //             setIngredients(data.meals);
    //             setIsLoaded(true);
    //         })
    //         .catch((error) => {
    //             setError(error);
    //             setIsLoaded(true);
    //         });
    // }, []);

    //Cached API
    useEffect(() => {
        fetch("http://localhost:3000/api/ingredients")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIngredients(data);
                setIsLoaded(true);
            })
            .catch((error) => {
                setError(error);
                setIsLoaded(true);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h1>Ingredients</h1>
                <Autocomplete
                    multiple
                    disablePortal
                    options={ingredients}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingredient"
                        />
                    )}
                />

                {/* <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Desc</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ingredient) => (
                            <tr key={ingredient.idIngredient}>
                                <td>{ingredient.idIngredient}</td>
                                <td>{ingredient.strIngredient}</td>
                                <td>{ingredient.strDescription}</td>
                                <td>{ingredient.strType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
            </div>
        );
    }
}

export default Ingredients;
