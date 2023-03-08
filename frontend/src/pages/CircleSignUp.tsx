import { useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
} from "@mui/material";

type FormState = {
    Name: string;
    Description: string;
    // could also be inferred from the person who created the circle once they are logged in
    OwnerUsername: string;
    // public or private - we can discuss if we want to add this and the description I included in the schema
    Type: string;
    confirm: string;
};

export const CircleSignUp: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        Name: "",
        Description: "",
        OwnerUsername: "",
        Type: "",
        confirm: "",
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
        console.log("Sign up");
        // Submit signup form here
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
                <br />

                <Avatar
                    sx={{
                        alignItems: "center",
                        width: 100,
                        height: 100,
                        top: "50%",
                        background:
                            "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                    }}
                ></Avatar>
                <br />

                <Typography component="h1" variant="h5">
                    Create a Circle
                </Typography>
                <br />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="Name"
                                variant="outlined"
                                required
                                fullWidth
                                id="Name"
                                label="Name"
                                value={formState.Name}
                                autoFocus
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="Description"
                                label="Description"
                                name="Description"
                                autoComplete="description"
                                value={formState.Description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="OwnerUsername"
                                label="Owner Username"
                                name="OwnerUsername"
                                autoComplete="username"
                                autoFocus
                                value={formState.OwnerUsername}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* To do: Make this drop down if we decide to add this */}
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="Type"
                                label="Private or Public"
                                id="Type"
                                autoComplete="Type"
                                value={formState.Type}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            background:
                                "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                        }}
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default CircleSignUp;
