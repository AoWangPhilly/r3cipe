import { Grid, MenuItem } from "@mui/material";
import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

type SearchFormState = {
    query: string;
    cuisine: string;
    mealtype: string;
    pantry: boolean;
    usersubmitted: boolean;
};

// find a way to check if the user is logged in - set to true for now
const isAuthenticated = true;
const Search = () => {
    const [searchFormState, setSearchFormState] = useState<SearchFormState>({
        query: "",
        cuisine: "",
        mealtype: "",
        usersubmitted: false,
        pantry: false,
    });

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
                            <MenuItem value="American">American</MenuItem>
                            <MenuItem value="Chinese">Chinese</MenuItem>
                            <MenuItem value="French">French</MenuItem>
                            <MenuItem value="Indian">Indian</MenuItem>
                            <MenuItem value="Italian">Italian</MenuItem>
                            <MenuItem value="Japanese">Japanese</MenuItem>
                            <MenuItem value="Korean">Korean</MenuItem>
                            <MenuItem value="Mexican">Mexican</MenuItem>
                            <MenuItem value="Thai">Thai</MenuItem>
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
                            <MenuItem value="Breakfast">Breakfast</MenuItem>
                            <MenuItem value="Lunch">Lunch</MenuItem>
                            <MenuItem value="Dinner">Dinner</MenuItem>
                            <MenuItem value="Dessert">Dessert</MenuItem>
                        </Select>
                    </Grid>
                    {isAuthenticated && (
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
                    {isAuthenticated && (
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
