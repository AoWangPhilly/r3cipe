import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Box, Grid, Typography, IconButton, Icon } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Ingredient } from "../types";
import { useState, useEffect } from "react";

interface IngredientRaw {
    id: number;
    name: string;
}

interface IngredientSelectProps {
    allIngredients: IngredientRaw[];
    ingredients: Ingredient[];
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

type FormState = {
    selectedIngredient: IngredientRaw | null;
    amount: string;
};
export const IngredientSelect = (props: IngredientSelectProps) => {
    const [formState, setFormState] = useState<FormState>({
        amount: "",
        selectedIngredient: null,
    });

    const { allIngredients, ingredients, setIngredients } = props;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (
        e: React.ChangeEvent<{}>,
        value: IngredientRaw | null
    ): void => {
        setFormState((prevState) => ({
            ...prevState,
            selectedIngredient: value,
        }));
    };

    const addIngredientOnClick = () => {
        if (formState.selectedIngredient === null) {
            return;
        }
        const selectedIngredient = formState.selectedIngredient;
        const amount = formState.amount;

        const ingredient: Ingredient = {
            id: selectedIngredient.id,
            original: `${amount} ${selectedIngredient.name}`,
            originalName: selectedIngredient.name,
        };
        setIngredients((prevState) => [...prevState, ingredient]);
        setFormState({
            amount: "",
            selectedIngredient: null,
        });
    };

    const SubmittedIngredient = (props: { ingredient: Ingredient }) => {
        return (
            <Grid
                container
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    border: "1px solid black",
                    borderRadius: "5px",
                    padding: "5px",
                    margin: "5px",
                    justifyContent: "space-between",
                }}
            >
                <Grid item display="flex">
                    <Typography>{props.ingredient.original}</Typography>
                </Grid>
                <Grid item display="flex">
                    <IconButton
                        color="error"
                        onClick={() => {
                            setIngredients(
                                ingredients.filter(
                                    (ingredient) =>
                                        ingredient.id !== props.ingredient.id
                                )
                            );
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    };

    const AddIngredient = () => {
        return (
            <Grid
                container
                spacing={2}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Grid item display="flex">
                    <TextField
                        name="amount"
                        variant="outlined"
                        required
                        fullWidth
                        id="amount"
                        sx={{ width: 100 }}
                        label="Amount"
                        value={formState.amount}
                        onChange={handleInputChange}
                        autoFocus
                    />
                </Grid>
                <Grid item display="flex">
                    <Autocomplete
                        disablePortal
                        id="tags-standard"
                        options={allIngredients}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={handleSelectChange}
                        value={formState.selectedIngredient}
                    />
                </Grid>
                <Grid item display="flex">
                    <IconButton
                        onClick={addIngredientOnClick}
                        color={"primary"}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid black",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
                width: "20%",
            }}
        >
            <Typography variant="h6">Ingredients</Typography>
            {ingredients.map((ingredient) => (
                <SubmittedIngredient ingredient={ingredient} key={ingredient.id} />
            ))}
            <AddIngredient />
        </Box>
    );
};
