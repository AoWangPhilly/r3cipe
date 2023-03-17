import { Box, Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GRADIENT } from "../util";

type FormState = {
    id: string;
};

const CircleSidebar = () => {
    const [formState, setFormState] = useState<FormState>({
        id: "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        console.log("Join Circle for Code: " + formState.id);

        // Submit signup form here for
        const response = await fetch("/api/circles/", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        });

        if (response.ok) {
            // Redirect to circle page
            const circleUrl = `/circle/${formState.id}`;
            navigate(circleUrl);
        } else {
            await response.json().then((data) => {
                console.log(data);
                setError("Cannot join Circle Page");
                return;
            });
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "30%",
                height: "100%",
                backgroundColor: "transparent",
                right: 0,
                position: "fixed",
                top: "65px", // add top to position the sidebar below the navbar
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                }}
            >
                Join with Code
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    autoComplete="id"
                    name="id"
                    variant="outlined"
                    required
                    fullWidth
                    id="id"
                    label="id"
                    value={formState.id}
                    autoFocus
                    onChange={handleInputChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        width: "100%",
                        my: 2,
                        background: GRADIENT,
                    }}
                >
                    Join
                </Button>
                <Typography color="firebrick">{error}</Typography>
            </form>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                }}
            >
                or
            </Typography>
            <Link to="/circle-create" style={{ textDecoration: "none" }}>
                <Button
                    variant="contained"
                    sx={{
                        width: "100%",
                        my: 2,
                        background: GRADIENT,
                    }}
                >
                    Create
                </Button>
            </Link>
        </Box>
    );
};

export default CircleSidebar;
