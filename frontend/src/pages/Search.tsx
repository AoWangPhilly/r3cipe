import { Button, Grid, MenuItem, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { CUISINES, DISH_TYPES, RecipeThumbnailType } from "../types";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RecipeThumbnail from "../components/RecipeThumbnail";
import {
    convertFullRecipesToThumbnails,
    convertSearchResultsToThumbnails,
} from "../util";
import { textAlign } from "@mui/system";

export type SearchFormState = {
    query: string;
    cuisine: string;
    mealtype: string;
    pantry: boolean;
    usersubmitted: boolean;
};

type Option = {
    value: string;
    label: string;
};

const cuisines: Option[] = CUISINES.map((cuisine: string) => ({
    value: cuisine.toLowerCase(),
    label: cuisine,
}));

const mealTypes: Option[] = DISH_TYPES.map((mealType: string) => ({
    value: mealType.toLowerCase(),
    label: mealType.charAt(0).toUpperCase() + mealType.slice(1),
}));

const Search = () => {
    const { isAuth } = useContext(AuthContext);

    const [recipes, setRecipes] = useState<RecipeThumbnailType[]>([]);
    const [searchFormState, setSearchFormState] = useState<SearchFormState>({
        query: "",
        cuisine: "",
        mealtype: "",
        usersubmitted: false,
        pantry: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const response = fetch("/api/search/spoonacular/recent", {
            method: "GET",
            credentials: "include",
        });
        response.then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data);
                    setRecipes(
                        convertFullRecipesToThumbnails(data.recentRecipes)
                    );
                });
            }
        });
    }, []);

    const handleFeelingHungryClick = () => {
        const queryParams = new URLSearchParams();
        queryParams.append("feelinghungry", "true");

        const searchUrl = `/search?${queryParams.toString()}`;
        navigate(searchUrl);
    };

    const handleSubmit = async (
        event:
            | React.MouseEvent<SVGSVGElement, MouseEvent>
            | React.KeyboardEvent<HTMLInputElement>
            | React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        event.preventDefault();
        console.log("Sign up");
        console.log(searchFormState);

        if (searchFormState.query === "") {
            // exit early if there is no search query
            return;
        }

        // search query params for search page
        const queryParams = new URLSearchParams();
        queryParams.append("query", searchFormState.query);
        if (searchFormState.cuisine !== "") {
            queryParams.append("cuisine", searchFormState.cuisine);
        }
        if (searchFormState.mealtype !== "") {
            queryParams.append("mealtype", searchFormState.mealtype);
        }
        if (searchFormState.usersubmitted && isAuth) {
            queryParams.append("usersubmitted", "true");
        } else {
            queryParams.append("usersubmitted", "false");
        }
        if (searchFormState.pantry && isAuth) {
            queryParams.append("pantry", "true");
        } else {
            queryParams.append("pantry", "false");
        }
        const searchUrl = `/search?${queryParams.toString()}`;
        navigate(searchUrl);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFormState({
            ...searchFormState,
            query: event.target.value,
        });
    };

    const handleCuisineSelectChange = (event: SelectChangeEvent<string>) => {
        setSearchFormState({
            ...searchFormState,
            cuisine: event.target.value as string,
        });
    };

    const handleMealTypeSelectChange = (event: SelectChangeEvent<string>) => {
        setSearchFormState({
            ...searchFormState,
            mealtype: event.target.value as string,
        });
    };

    const handleUserSubmittedToggleChange = () => {
        setSearchFormState({
            ...searchFormState,
            usersubmitted: !searchFormState.usersubmitted,
        });
    };

    const handlePantryToggleChange = () => {
        setSearchFormState({
            ...searchFormState,
            pantry: !searchFormState.pantry,
        });
    };

    return (
        <>
            <form>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ margin: "auto", width: "70%" }}
                >
                    <Grid
                        item
                        xs={12}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography variant={"h4"}>Search</Typography>
                    </Grid>
                    <Grid item xs={12} alignItems="center">
                        <TextField
                            sx={{
                                margin: "auto",
                                width: "97.5%",
                            }}
                            id="outlined-basic"
                            label="Search for recipe"
                            variant="outlined"
                            value={searchFormState.query}
                            onChange={handleInputChange}
                            InputProps={{
                                endAdornment: (
                                    <SearchIcon
                                        color="action"
                                        type="submit"
                                        onClick={handleSubmit}
                                        style={{ cursor: "pointer" }}
                                    />
                                ),
                                onKeyDown: (
                                    event: React.KeyboardEvent<HTMLInputElement>
                                ) => {
                                    if (event.key === "Enter") {
                                        handleSubmit(event);
                                    }
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} container spacing={0.5}>
                        <Grid item xs={3}>
                            <Select
                                value={searchFormState.cuisine}
                                onChange={handleCuisineSelectChange}
                                displayEmpty
                                sx={{ margin: "auto", width: "50%" }}
                            >
                                <MenuItem value="">Cuisine</MenuItem>

                                {cuisines.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <Select
                                value={searchFormState.mealtype}
                                displayEmpty
                                onChange={handleMealTypeSelectChange}
                                sx={{ margin: "auto", width: "50%" }}
                            >
                                <MenuItem value="">Meal Type</MenuItem>
                                {mealTypes.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        {isAuth && (
                            <Grid item xs={3}>
                                <ToggleButton
                                    color="primary"
                                    value="check"
                                    selected={searchFormState.usersubmitted}
                                    onChange={handleUserSubmittedToggleChange}
                                    sx={{ margin: "auto", width: "50%" }}
                                >
                                    User Submitted
                                </ToggleButton>
                            </Grid>
                        )}
                        {isAuth && (
                            <Grid item xs={3}>
                                <ToggleButton
                                    color="primary"
                                    value="check"
                                    selected={searchFormState.pantry}
                                    onChange={handlePantryToggleChange}
                                    sx={{ margin: "auto", width: "50%" }}
                                >
                                    Pantry
                                </ToggleButton>
                            </Grid>
                        )}
                    </Grid>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ margin: "auto", width: "100%" }}
                    >
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={handleSubmit}
                                startIcon={<SearchIcon />}
                                sx={{
                                    borderRadius: "10px",
                                    padding: "8px 16px",
                                    color: "#fff",
                                    textTransform: "capitalize",
                                    width: "50%",
                                }}
                            >
                                Search
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFeelingHungryClick}
                                startIcon={
                                    <span role="img" aria-label="hungry-face">
                                        🍽️
                                    </span>
                                }
                                sx={{
                                    borderRadius: "10px",
                                    padding: "8px 16px",
                                    margin: "auto",
                                    color: "#fff",
                                    textTransform: "capitalize",
                                    width: "50%",
                                }}
                            >
                                I am feeling hungry
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

            <Typography
                variant="h5"
                sx={{ margin: "20px 0 10px 0", textAlign: "center" }}
            >
                🔥 Trending Recipes
            </Typography>

            {
                // if there are no recipes, display a message
                recipes.length === 0 ? (
                    <Typography variant="h6">
                        No recipes found. Try a different search.
                    </Typography>
                ) : (
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            display: "flex",
                            margin: "auto",
                            justifyContent: "center",
                            width: "80%",
                        }}
                    >
                        {recipes.map((recipe: RecipeThumbnailType) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={recipe.id}
                            >
                                <RecipeThumbnail recipeThumbnail={recipe} />
                            </Grid>
                        ))}
                    </Grid>
                )
            }
        </>
    );
};

export default Search;
