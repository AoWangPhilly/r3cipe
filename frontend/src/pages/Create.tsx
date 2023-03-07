import { RecipeType, Ingredient } from "../types";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IngredientSelect } from "../components/IngredientSelect";
import { InstructionsInput } from "../components/InstructionsInput";
interface IngredientRaw {
    id: number;
    name: string;
}

interface Instructions {
    instruction: string;
}
export const Create = () => {
    const [formState, setFormState] = useState<RecipeType>({
        title: "",
        summary: "",
        extendedIngredients: [],
        instructions: "",
        image: "",
        imageType: "",
        preparationMinutes: 0,
        cookingMinutes: 0,
        sourceUrl: "",
        servings: 0,
        id: 0,
        cuisines: [],
        dishTypes: [],
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [allIngredients, setAllIngredients] = useState<IngredientRaw[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/ingredients", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setAllIngredients(data.ingredients);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault(); // prevent default form submission behavior
        console.log(formState);
    };

    if (loading) {
        return <h1>Loading...</h1>;
    } else if (error) {
        return <h1>{error}</h1>;
    } else {
        return (
            <div>
                <h1>Create a recipe</h1>
                <form onSubmit={handleSubmit}>
                    <IngredientSelect
                        allIngredients={allIngredients}
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                    />
                    <InstructionsInput
                        instructions={instructions}
                        setInstructions={setInstructions}
                    />
                </form>
            </div>
        );
    }
};

export default Create;
