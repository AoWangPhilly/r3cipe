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

interface FormState {
    name: string;
    description: string;
    ownerUsername: string;
    confirm: string;
}

const CircleSignUp = () => {
    const [formState, setFormState] = useState<FormState>({
        name: "",
        description: "",
        ownerUsername: "",
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

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        console.log("Sign up");
        // Submit signup form here
        const response = await fetch("/api/circles", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        });

        if (response.status === 200) {
            console.log("Success");
        } else {
            await response.json().then((data) => {
                console.log(data);
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <br />
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        background:
                            "linear-gradient(45deg, #2196F3 40%, #21CBF3 80%)",
                    }}
                ></Avatar>
                <br />
                <Typography
                    component="h1"
                    variant="h5"
                    style={{ marginBottom: "15px" }}
                >
                    Create a Circle
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="off"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                value={formState.name}
                                autoFocus
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                autoComplete="off"
                                value={formState.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="ownerUsername"
                                label="Owner Username"
                                name="ownerUsername"
                                autoComplete="off"
                                value={formState.ownerUsername}
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
                            marginTop: "20px",
                            marginBottom: "10px",
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
