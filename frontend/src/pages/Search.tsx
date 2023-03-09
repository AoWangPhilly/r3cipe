import { Grid, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { CUISINES, DISH_TYPES } from "../types";
import { useNavigate } from "react-router-dom";

// find a way to check if the user is logged in - set to true for now
const isLoggedIn = true;

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
    const [searchFormState, setSearchFormState] = useState<SearchFormState>({
        query: "",
        cuisine: "",
        mealtype: "",
        usersubmitted: false,
        pantry: false,
    });
    const navigate = useNavigate();

    /* useEffect(() => {
        console.log("test authorize middleware");
        let temp = async () => {
            console.log("sending");
            let resp = await fetch("/api/auth/dummy", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(resp.status);
        };
        temp();
    }, []); */

    const handleSubmit = async (
        event:
            | React.MouseEvent<SVGSVGElement, MouseEvent>
            | React.KeyboardEvent<HTMLInputElement>
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
        if (searchFormState.usersubmitted && isLoggedIn) {
            queryParams.append("usersubmitted", "true");
        } else {
            queryParams.append("usersubmitted", "false");
        }
        if (searchFormState.pantry && isLoggedIn) {
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
        <form>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ margin: "auto", width: "70%"}}
            >
                <Grid item xs={12} justifyContent="center" alignItems="center">
                    <h1>Search</h1>
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
                    {isLoggedIn && (
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
                    {isLoggedIn && (
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
            </Grid>
        </form>
    );
};

export default Search;
