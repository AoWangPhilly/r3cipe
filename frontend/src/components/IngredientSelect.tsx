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

const SubmittedIngredient = (props: {
    ingredient: Ingredient;
    ingredients: Ingredient[];
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}) => {
    const { setIngredients, ingredients } = props;
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

const AddIngredient = (props: {
    allIngredients: IngredientRaw[];
    ingredients: Ingredient[];
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    formState: FormState;
    setFormState: React.Dispatch<React.SetStateAction<FormState>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (
        e: React.ChangeEvent<{}>,
        value: IngredientRaw | null
    ) => void;
    addIngredientOnClick: () => void;
}) => {
    const {
        allIngredients,
        ingredients,
        setIngredients,
        formState,
        setFormState,
        handleInputChange,
        handleSelectChange,
        addIngredientOnClick,
    } = props;

    return (
        <Grid
            container
            spacing={2}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
            width="100%"
        >
            <Grid item display="flex" width="20%">
                <TextField
                    name="amount"
                    variant="outlined"
                    fullWidth
                    id="amount"
                    label="Amount"
                    value={formState.amount}
                    onChange={handleInputChange}
                    autoFocus
                />
            </Grid>
            <Grid item display="flex" width="40%">
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
                <IconButton onClick={addIngredientOnClick} color={"primary"}>
                    <AddIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
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
                width: "85%",
            }}
        >
            <Typography variant="h6">Ingredients</Typography>
            {ingredients.map((ingredient) => (
                <SubmittedIngredient
                    ingredient={ingredient}
                    key={ingredient.id}
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                />
            ))}
            <AddIngredient
                allIngredients={allIngredients}
                ingredients={ingredients}
                setIngredients={setIngredients}
                formState={formState}
                setFormState={setFormState}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                addIngredientOnClick={addIngredientOnClick}
            />
        </Box>
    );
};
