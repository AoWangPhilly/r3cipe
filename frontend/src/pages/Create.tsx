import { RecipeType, Ingredient, CUISINES, DISH_TYPES } from "../types";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IngredientSelect } from "../components/IngredientSelect";
import { InstructionsInput } from "../components/InstructionsInput";
import {
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
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
        image: "https://www.justonecookbook.com/wp-content/uploads/2021/10/Chicken-Katsu-3818-II.jpg",
        imageType: "jpg",
        preparationMinutes: 20,
        cookingMinutes: 20,
        sourceUrl: "",
        servings: 20,
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChangeCuisine = (
        e: React.ChangeEvent<{}>,
        value: string[]
    ): void => {
        setFormState((prevState) => ({
            ...prevState,
            cuisines: value,
        }));
    };

    const handleSelectChangeDishType = (
        e: React.ChangeEvent<{}>,
        value: string[]
    ): void => {
        setFormState((prevState) => ({
            ...prevState,
            dishTypes: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior
        e.preventDefault();
        for (let i = 1; i <= instructions.length; i++) {
            formState.instructions += instructions[i - 1] + "\n";
        }

        //make instructions into a string, separated by newlines

        const recipe: RecipeType = {
            title: formState.title,
            summary: formState.summary,
            extendedIngredients: ingredients,
            instructions: formState.instructions,
            image: formState.image,
            imageType: formState.imageType,
            preparationMinutes: formState.preparationMinutes,
            cookingMinutes: formState.cookingMinutes,
            sourceUrl: formState.sourceUrl,
            servings: formState.servings,
            id: formState.id,
            cuisines: formState.cuisines,
            dishTypes: formState.dishTypes,
        };
        console.log(recipe);
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={formState.title}
                                        onChange={handleInputChange}
                                        autoFocus
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Summary"
                                        name="summary"
                                        value={formState.summary}
                                        onChange={handleInputChange}
                                        autoFocus
                                        required
                                        sx={{
                                            width: "85%",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        aria-label="cuisines"
                                        id="tags-standard"
                                        options={CUISINES}
                                        multiple
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Cuisine"
                                            />
                                        )}
                                        onChange={handleSelectChangeCuisine}
                                        value={formState.cuisines}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        aria-label="dishTypes"
                                        id="tags-standard"
                                        options={DISH_TYPES}
                                        multiple
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Dish Type"
                                            />
                                        )}
                                        onChange={handleSelectChangeDishType}
                                        value={formState.dishTypes}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Image"
                                        name="image"
                                        value={formState.image}
                                        onChange={handleInputChange}
                                        autoFocus
                                        required
                                        sx={{
                                            width: "60%",
                                        }}
                                    />
                                    <TextField
                                        label="Type"
                                        name="imageType"
                                        value={formState.imageType}
                                        onChange={handleInputChange}
                                        autoFocus
                                        sx={{
                                            width: "10%",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Preparation Minutes"
                                        name="preparationMinutes"
                                        value={formState.preparationMinutes}
                                        onChange={handleInputChange}
                                        type="number"
                                        autoFocus
                                        required
                                        sx={{
                                            width: "15%",
                                        }}
                                    />

                                    <TextField
                                        label="Cooking Minutes"
                                        name="cookingMinutes"
                                        value={formState.cookingMinutes}
                                        onChange={handleInputChange}
                                        autoFocus
                                        type="number"
                                        required
                                        sx={{
                                            width: "15%",
                                        }}
                                    />
                                    <TextField
                                        label="Servings"
                                        name="servings"
                                        value={formState.servings}
                                        onChange={handleInputChange}
                                        autoFocus
                                        type="number"
                                        required
                                        sx={{
                                            width: "15%",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Source URL"
                                        name="sourceUrl"
                                        value={formState.sourceUrl}
                                        onChange={handleInputChange}
                                        autoFocus
                                        sx={{
                                            width: "60%",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <IngredientSelect
                                allIngredients={allIngredients}
                                ingredients={ingredients}
                                setIngredients={setIngredients}
                            />
                            <InstructionsInput
                                instructions={instructions}
                                setInstructions={setInstructions}
                            />
                        </Grid>
                        <Grid item xs={12}></Grid>
                        {/* <Grid item xs={12}>
                            <Select
                                label="Dish Types"
                                name="dishTypes"
                                value={formState.dishTypes}
                                onChange={handleSelectChange}
                            />
                        </Grid> */}
                    </Grid>

                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
};

export default Create;
