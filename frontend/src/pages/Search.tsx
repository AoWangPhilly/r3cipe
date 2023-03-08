import { Grid, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

// find a way to check if the user is logged in - set to true for now
const isLoggedIn = true;

type SearchFormState = {
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

const cuisines: Option[] = [
    { value: "american", label: "American" },
    { value: "chinese", label: "Chinese" },
    { value: "french", label: "French" },
    { value: "indian", label: "Indian" },
    { value: "mexican", label: "Mexican" },
    { value: "african", label: "African" },
    { value: "vietnamese", label: "Vietnamese" },
    { value: "italian", label: "Italian" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "thai", label: "Thai" },
];

const mealTypes: Option[] = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "dessert", label: "Dessert" },
];

const Search = () => {
    const [searchFormState, setSearchFormState] = useState<SearchFormState>({
        query: "",
        cuisine: "",
        mealtype: "",
        usersubmitted: false,
        pantry: false,
    });

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
        console.log(JSON.stringify(searchFormState));

        if (searchFormState.query === "") {
            // exit early if there is no search query
            return;
        }

        let response = await fetch("/api/search", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(searchFormState),
        });
        if (response.status === 200) {
            console.log("Success");
        } else {
            await response.json().then((data) => {
                console.log(data);
            });
        }
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
