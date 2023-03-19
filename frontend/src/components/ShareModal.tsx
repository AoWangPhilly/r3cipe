import {
    Dialog,
    DialogTitle,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
} from "@mui/material";
import React from "react";
import { CircleType } from "../types";

interface ShareModalProps {
    shareModalOpen: boolean;
    handleShareModalClose: () => void;
    circles: CircleType[];
    setSelectedCircle: React.Dispatch<React.SetStateAction<string>>;
    selectedCircle: string;
    recipeId: string;
    recipeTitle: string;
    recipeImage: string;
}

const ShareModal = (props: ShareModalProps) => {
    const {
        shareModalOpen,
        handleShareModalClose,
        circles,
        selectedCircle,
        setSelectedCircle,
        recipeId,
        recipeImage,
        recipeTitle,
    } = props;
    const [message, setMessage] = React.useState("");

    const handleShare = () => {
        // send a post request to the backend to share the recipe to the selected circle
        // with the message
        // then close the modal
        fetch(`/api/circles/${selectedCircle}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipeId,
                message,
                title: recipeTitle,
                image: recipeImage,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                handleShareModalClose();
            });
    };

    return (
        <Dialog
            open={shareModalOpen}
            onClose={handleShareModalClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">
                {"Share to Circle"}
            </DialogTitle>
            <Grid
                container
                spacing={3}
                sx={{
                    margin: "auto",
                    width: "80%",
                    marginTop: "2rem",
                    marginBottom: "2rem",
                }}
            >
                {/* make a dropdown of circles, and a message box, and a send button */}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Circle
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedCircle}
                            label="Circle"
                            onChange={(e) =>
                                setSelectedCircle(e.target.value as string)
                            }
                        >
                            {circles.map((circle) => (
                                <MenuItem key={circle._id} value={circle._id}>
                                    {circle.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Message"
                        multiline
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleShare}
                    >
                        Send
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default ShareModal;
