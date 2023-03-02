import { useState, useContext, useEffect } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
    Typography,
    Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext, checkAuth } from "../context/AuthContext";

type FormState = {
    email: string;
    password: string;
};

export const Login: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string>("");
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // useEffect(() => {
    //     checkAuth().then((result) => {
    //         setIsAuth(result);
    //     });
    // }, []);

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
        e.preventDefault(); // prevent default form submission behavior
        if (formState.email === "" || formState.password === "") {
            alert("Please fill in all fields");
            return;
        }
        let response = await fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        });
        if (response.status === 200) {
            setIsAuth(true);
            if (searchParams.get("redirect") !== null) {
                navigate("/" + searchParams.get("redirect"));
            } else {
                navigate("/");
            }
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formState.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formState.password}
                        onChange={handleInputChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Login
                    </Button>
                    <Typography color="firebrick">{error}</Typography>
                    <Grid container>
                        {/* <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid> */}
                        <Grid item>
                            <Link to="/signup">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
