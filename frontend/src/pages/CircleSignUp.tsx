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
import GroupAddIcon from "@mui/icons-material/GroupAdd";
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
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    let FileInput: HTMLInputElement | null = null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setCurrentFile(file);
        }
    };
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
            let uploadPromise = Promise.resolve("");
            if (currentFile) {
                const data = new FormData();
                data.append("image", currentFile);
                uploadPromise = fetch("/api/upload", {
                    method: "POST",
                    credentials: "include",
                    body: data,
                })
                    .then((response) => response.json())
                    .then((data) => data.path);
            }
            uploadPromise
                .then(async (path) => {
                    console.log(path);
                    const response = await fetch("/api/circles", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: formState.name,
                            description: formState.description,
                            imageUrl: path,
                        }),
                    });
                    setIsLoading(false);
                    if (response.ok) {
                        const data = await response.json();
                        // Redirect to circle page
                        const id = data.socialCircle._id;
                        const circleUrl = `/circle/${id}`;
                        navigate(circleUrl);
                    } else {
                        const errorData = await response.json();
                        console.log(errorData);
                        setError(errorData.message);
                    }
                });
        } catch (error) {
            console.log(error);
            setError("An error occurred! Please try again");
        }
    };
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <br />
            <br />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    style={{ marginBottom: "15px" }}
                >
                    Create a Circle
                </Typography>
                <br />
                <input
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    ref={(fileInput) => (FileInput = fileInput)}
                    accept="image/*"
                    name="image"
                    id="image"
                />
                <Avatar
                    onClick={() => FileInput?.click()}
                    sx={{ width: 100, height: 100 }}
                >
                    {currentFile ? (
                        <img
                            src={URL.createObjectURL(currentFile)}
                            alt="avatar"
                            style={{ height: "100%" }}
                        />
                    ) : (
                        <GroupAddIcon />
                    )}
                </Avatar>

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
