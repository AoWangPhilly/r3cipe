import { RecipeType, Ingredient, CUISINES, DISH_TYPES } from "../types";
import { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IngredientSelect } from "../components/IngredientSelect";
import { InstructionsInput } from "../components/InstructionsInput";
import {
    Button,
    FormControlLabel,
    Grid,
    Switch,
    CircularProgress,
    Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DeleteRecipeModal from "../components/DeleteRecipeModal";

interface IngredientRaw {
    id: number;
    name: string;
}

interface RecipeInputProps {
    isEdit?: boolean;
}

export const RecipeInput = (props: RecipeInputProps) => {
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
        cuisines: [],
        dishTypes: [],
    });
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const { userId } = useContext(AuthContext);
    const [owner, setOwner] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [allIngredients, setAllIngredients] = useState<IngredientRaw[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<string[]>([]);
    const { id } = useParams<{ id: string }>();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [deleteRecipeModalOpen, setDeleteRecipeModalOpen] = useState<boolean>(
        false
    );
    let FileInput: HTMLInputElement | null = null;
    const navigate = useNavigate();

    const handleDeleteRecipeModalOpen = () => {
        setDeleteRecipeModalOpen(true);
    };

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
            });
        if (props.isEdit) {
            fetch(`/api/search/recipe/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setFormState(data.recipe.recipe);
                    setIngredients(data.recipe.recipe.extendedIngredients);
                    let instructions =
                        data.recipe.recipe.instructions.split("\n");
                    // remove empty string at end
                    instructions.pop();
                    setInstructions(instructions);
                    setIsPublic(data.recipe.isPublic);
                    setOwner(data.recipe.userId);
                    setImageUrl(data.recipe.recipe.image);
                    // console.log(
                    //     "Instructions set after api call: ",
                    //     instructions
                    // );
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [props.isEdit, id]);

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

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPublic(e.target.checked);
    };

    const handleDelete = async () => {
        await fetch("/api/user/recipes/" + id, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            navigate("/library");
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file.size > 5000000) {
                alert("File size must be less than 5MB");
                return;
            }
            setCurrentFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior
        e.preventDefault();
        formState.instructions = "";
        for (let i = 0; i < instructions.length; i++) {
            formState.instructions += instructions[i] + "\n";
        }
        // console.log("Instructions set before update/save call: ", instructions);
        // console.log(
        //     "Instructions set before update/save call: ",
        //     formState.instructions
        // );

        if (formState.instructions === "") {
            alert("Please enter instructions");
            return;
        }

        if (ingredients.length === 0) {
            alert("Please enter ingredients");
            return;
        }

        let uploadPromise = Promise.resolve(imageUrl);
        if (currentFile) {
            const formData = new FormData();
            formData.append("image", currentFile);
            uploadPromise = fetch("/api/upload", {
                method: "POST",
                credentials: "include",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => data.path);
        } else if (imageUrl === "") {
            alert("Please upload an image");
            return;
        }
        uploadPromise.then(async (path) => {
            const recipe: RecipeType = {
                title: formState.title,
                summary: formState.summary,
                extendedIngredients: ingredients,
                instructions: formState.instructions,
                image: path ? path : imageUrl,
                imageType: formState.imageType,
                preparationMinutes: formState.preparationMinutes,
                cookingMinutes: formState.cookingMinutes,
                sourceUrl: formState.sourceUrl,
                servings: formState.servings,
                cuisines: formState.cuisines,
                dishTypes: formState.dishTypes,
            };
            const requestObject = {
                recipe: recipe,
                isPublic: isPublic,
            };
            if (props.isEdit) {
                await fetch("/api/user/recipes/" + id, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestObject),
                })
                    .then((res) => {
                        if (res.status === 201) {
                            navigate(`/recipe/${id}`);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                await fetch("/api/user/recipes/", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestObject),
                })
                    .then((res) => {
                        res.json().then((data) => {
                            // console.log(data);
                            navigate(`/recipe/${data.userRecipe.recipeId}`);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    };

    if (loading) {
        return <CircularProgress />;
    } else if (props.isEdit && userId !== owner) {
        return <h1>Not authorized to edit this recipe</h1>;
    } else if (error) {
        console.log(error);
        return <h1>Error</h1>;
    } else {
        return (
            <>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "80%",
                        height: "100%",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    {props.isEdit ? (
                        <h1>Edit Recipe</h1>
                    ) : (
                        <h1>Create Recipe</h1>
                    )}
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2} display="flex">
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Title"
                                            name="title"
                                            value={formState.title}
                                            onChange={handleInputChange}
                                            required
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Summary"
                                            name="summary"
                                            value={formState.summary}
                                            onChange={handleInputChange}
                                            required
                                            sx={{
                                                width: "85%",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} display="flex">
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
                                            sx={{
                                                width: "40%",
                                                color: "white",
                                            }}
                                        />
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
                                            onChange={
                                                handleSelectChangeDishType
                                            }
                                            value={formState.dishTypes}
                                            sx={{
                                                width: "40%",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}></Grid>
                                    <Grid item xs={12}>
                                        <input
                                            type="file"
                                            onChange={handleFileSelect}
                                            style={{ display: "none" }}
                                            ref={(fileInput) =>
                                                (FileInput = fileInput)
                                            }
                                            accept="image/*"
                                            name="image"
                                            id="image"
                                        />
                                        <Button
                                            startIcon={<CloudUploadIcon />}
                                            variant="contained"
                                            color="primary"
                                            onClick={() => FileInput?.click()}
                                        >
                                            Upload Image
                                        </Button>
                                        {currentFile && (
                                            <div>
                                                <p>
                                                    Selected file:{" "}
                                                    {currentFile.name}
                                                </p>
                                            </div>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Preparation Minutes"
                                            name="preparationMinutes"
                                            value={formState.preparationMinutes}
                                            onChange={handleInputChange}
                                            type="number"
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
                                            sx={{
                                                width: "60%",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isPublic}
                                            onChange={handleSwitchChange}
                                            name="isPublic"
                                            inputProps={{
                                                "aria-label": "controlled",
                                            }}
                                        />
                                    }
                                    label="Public?"
                                />
                                <Button variant="contained" type="submit">
                                    {props.isEdit ? "Save" : "Create Recipe"}
                                </Button>
                                {props.isEdit ? (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteRecipeModalOpen}
                                    >
                                        Delete
                                    </Button>
                                ) : null}
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
                        </Grid>
                        <br />
                    </form>
                </Box>
                <DeleteRecipeModal
                    deleteRecipeModalOpen={deleteRecipeModalOpen}
                    setDeleteRecipeModalOpen={setDeleteRecipeModalOpen}
                    recipeId={id!}
                />
            </>
        );
    }
};

export default RecipeInput;
