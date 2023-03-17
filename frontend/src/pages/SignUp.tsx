import {
    useState,
    useEffect,
    useContext,
    SetStateAction,
    ChangeEventHandler,
} from "react";
import {
    Avatar,
    Button,
    TextField,
    Grid,
    Typography,
    Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext, checkAuth } from "../context/AuthContext";

type FormState = {
    name: string;
    email: string;
    password: string;
    confirm: string;
    profileUrl: string;
};

export const SignUp: React.FC = () => {
    const [nameError, setNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmError, setConfirmError] = useState<string>("");
    const [backendError, setBackendError] = useState<string>("");
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    let FileInput: HTMLInputElement | null = null;
    const [formState, setFormState] = useState<FormState>({
        name: "",
        email: "",
        password: "",
        confirm: "",
        profileUrl: "",
    });

    //use auth contexrt
    const { setIsAuth, setName, setUserId } = useContext(AuthContext);

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
        //reset errors
        setBackendError("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmError("");
        let errors = false;

        //all fields must be filled
        if (
            formState.name === "" ||
            formState.email === "" ||
            formState.password === "" ||
            formState.confirm === ""
        ) {
            alert("Please fill in all fields");
            return;
        }
        //name must be at least 2 characters
        if (formState.name.length < 2) {
            setNameError("Name must be at least 2 characters");
            errors = true;
        }
        //email must be valid
        if (!formState.email.includes("@")) {
            setEmailError("Email must be valid");
            errors = true;
        }
        //password must be at least 6 characters
        if (formState.password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            errors = true;
        }
        //password and confirm must match
        if (formState.password !== formState.confirm) {
            setConfirmError("Passwords must match");
            errors = true;
        }
        //if no errors, submit form
        if (!errors) {
            //submit
            let uploadPromise = Promise.resolve("");
            if (currentFile) {
                const data = new FormData();
                data.append("image", currentFile!);
                console.log(data);
                uploadPromise = fetch("/api/upload", {
                    method: "POST",
                    body: data,
                })
                    .then((response) => response.json())
                    .then((data) => data.path);
            }

            uploadPromise
                .then(async (path) => {
                    let response = await fetch("/api/auth/signup", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: formState.name,
                            email: formState.email,
                            password: formState.password,
                            profileUrl: path ? path : "",
                        }),
                    });
                    if (response.status !== 200) {
                        await response
                            .json()
                            .then((data) => setBackendError(data.errors[0]));
                    }
                })
                .then(() => {
                    checkAuth().then((result: any) => {
                        if (result.message === "Authenticated") {
                            setIsAuth(true);
                            setName(result.user.name);
                            setUserId(result.user.id);
                            navigate("/");
                        } else {
                            setBackendError("Invalid username or password");
                        }
                    });
                });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file.size > 5000000) {
                alert("File size must be less than 5MB");
                return;
            }
            setCurrentFile(file);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <div>
                <br />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        {/* center the grid item */}
                        <Grid item xs={12} style={{ textAlign: "center" }}>
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
                                    <LockOutlinedIcon />
                                )}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                value={formState.name}
                                autoFocus
                                onChange={handleInputChange}
                                error={nameError !== ""}
                                helperText={nameError}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                error={emailError !== ""}
                                helperText={emailError}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                error={passwordError !== ""}
                                helperText={passwordError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="confirm"
                                label="Confirm Password"
                                type="password"
                                id="confirm"
                                value={formState.confirm}
                                onChange={handleInputChange}
                                error={confirmError !== ""}
                                helperText={confirmError}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign Up
                    </Button>
                    <Typography color="firebrick">{backendError}</Typography>

                    <Grid container>
                        {/* <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid> */}
                        <Grid item>
                            <Link to="/login">
                                {"Already have an account? Log In"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default SignUp;
