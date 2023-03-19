import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Button,
    Box,
    Chip,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface PantryModalProps {
    pantryOpen: boolean;
    handlePantryClose: () => void;
}

interface IngredientRaw {
    id: number;
    name: string;
}

interface PantryDisplayProps {
    pantry: string[];
}

const PantryDisplay: React.FC<PantryDisplayProps> = ({ pantry }) => {
    if (pantry.length === 0) {
        return (
            <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                    Your pantry is currently empty
                </Typography>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mt: 2, mb: 1 }}
                >
                    Your current pantry items:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {pantry.map((item) => (
                    <Chip
                        key={item}
                        label={item}
                        sx={{ margin: 0.5 }}
                        size="small"
                    />
                ))}
            </Grid>
        </Grid>
    );
};

const PantryForm: React.FC = () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [pantryItems, setPantryItems] = useState<string[]>([]);
    const [onPantry, setOnPantry] = useState<boolean>(false);
    const [allIngredients, setAllIngredients] = useState<string[]>([]);
    const [ingredientsLoading, setIngredientsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAllIngredients = async () => {
            try {
                setIngredientsLoading(true);

                // console.log("Fetching ingredients");
                const response = await fetch("/api/ingredients", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status === 200) {
                    const data = await response.json();
                    const ingredientNames = data.ingredients.map(
                        (ingredient: IngredientRaw) => ingredient.name
                    );
                    // console.log("Checking ingredients: ");

                    setAllIngredients(ingredientNames);
                    // console.log("Setting ingredients: ");
                } else {
                    // console.log("Error occurred while fetching ingredients");
                    alert("Error occurred while fetching ingredients")
                }
            } catch (error) {
                console.error(error);
            }
            setIngredientsLoading(false);
        };
        getAllIngredients();
    }, []);

    useEffect(() => {
        const getPantry = async () => {
            try {
                const response = await fetch("/api/user/inventory/pantry", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status === 201) {
                    const data = await response.json();
                    setPantryItems(data);
                    setOnPantry(false);
                } else {
                    // console.log("Error occurred while fetching pantry");
                    alert("Error occurred while fetching pantry")
                }
            } catch (error) {
                console.error(error);
            }
        };
        getPantry();
    }, [onPantry]);

    useEffect(() => {}, [pantryItems]);

    const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
        // console.log(e.target.value);
        setSelectedItems(e.target.value as string[]);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        // give the option to select nothing in the pantry
        // if (selectedItems.length === 0) {
        //     setMessage("Please select at least one item");
        //     setLoading(false);
        //     return;
        // }

        try {
            const response = await fetch("/api/user/inventory/pantry", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pantry: selectedItems }),
            });

            if (response.status === 201) {
                setSelectedItems([]); // clear selected items
            } else {
                setMessage("An error occurred.");
            }
        } catch (error) {
            setMessage("An error occurred.");
        }
        setLoading(false);
        setOnPantry(true);
    };

    if (ingredientsLoading) {
        return <CircularProgress />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <PantryDisplay pantry={pantryItems} />

                <Grid item xs={12}>
                    <Typography variant="h6">Add Items to Pantry</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="pantry-items-label">
                            Pantry Items
                        </InputLabel>
                        <Select
                            labelId="pantry-items-label"
                            id="pantry-items-select"
                            multiple
                            value={selectedItems}
                            onChange={handleSelectChange}
                            input={<Input />}
                            renderValue={(selected) =>
                                selected.map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        sx={{ margin: 0.5 }}
                                        size="small"
                                        onClick={() => {
                                            // console.log(selectedItems, value);
                                            setSelectedItems(
                                                selectedItems.filter(
                                                    (item) => item !== value
                                                )
                                            );
                                        }}
                                    />
                                ))
                            }
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            }}
                        >
                            {allIngredients.map((item) => (
                                <MenuItem
                                    key={item}
                                    value={item}
                                    style={{
                                        fontWeight: "normal",
                                    }}
                                >
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>

                        <FormHelperText>Select pantry items</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                        SAVE PANTRY
                    </Button>
                    {loading && (
                        <CircularProgress size={24} sx={{ marginLeft: 1 }} />
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant="body1"
                        color={
                            message === "An error occurred." ? "error" : "green"
                        }
                    >
                        {message}
                    </Typography>
                </Grid>
            </Grid>
        </form>
    );
};

const PantryModal = (props: PantryModalProps) => {
    const { pantryOpen, handlePantryClose } = props;
    return (
        <Dialog
            open={pantryOpen}
            onClose={handlePantryClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={"lg"}
        >
            <DialogTitle id="alert-dialog-title">{"Pantry"}</DialogTitle>
            <DialogContent>
                <PantryForm />
            </DialogContent>
        </Dialog>
    );
};

export default PantryModal;
