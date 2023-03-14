import { useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface FormState {
    name: string;
    description: string;
    confirm: string;
}

const CircleSignUp = () => {
    const [formState, setFormState] = useState<FormState>({
        name: "",
        description: "",
        confirm: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

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
        setIsLoading(true);

        try {
            const response = await fetch("/api/circles", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            setIsLoading(false);

            if (response.status === 200) {
                const data = await response.json();
                console.log(data);

                // Redirect to circle page
                const id = data.socialCircle.id;
                const circleUrl = `/circle/${id}`;
                navigate(circleUrl);
            } else {
                const errorData = await response.json();
                console.log(errorData);
                setError(errorData.message);
            }
        } catch (error) {
            console.log(error);
            setError("An error occurred! Please try again");
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
                >
                    {formState.name.charAt(0).toUpperCase()}
                </Avatar>
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
                    </Grid>
                    {isLoading ? (
                        <CircularProgress
                            sx={{ marginTop: "20px", marginBottom: "10px" }}
                        />
                    ) : (
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
                    )}
                </form>
            </div>
        </Container>
    );
};

export default CircleSignUp;
