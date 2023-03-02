import { Box, Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link } from "react-router-dom";

const CircleSidebar = () => {
    type FormState = {
        Code: string;
    };
    const [formState, setFormState] = useState<FormState>({
        Code: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log("Join Circle for Code: " + formState.Code);
        // Get code from form and submit to backend
        //  if code is invalid, display error message
        // axios.post("/api/circle/join", { Code: formState.Code }).then((res) => {
        //     console.log(res);
        //     if (res.data.success) {
        //         //  if code is valid, redirect to selected circle page
        //     } else {
        //         // error message
        //     }
        // });
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
                    autoComplete="Code"
                    name="Code"
                    variant="outlined"
                    required
                    fullWidth
                    id="Code"
                    label="Code"
                    value={formState.Code}
                    autoFocus
                    onChange={handleInputChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        width: "100%",
                        my: 2,
                        background:
                            "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                    }}
                >
                    Join
                </Button>
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
                        background:
                            "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                    }}
                >
                    Create
                </Button>
            </Link>
        </Box>
    );
};

export default CircleSidebar;
