import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface DeleteCircleProps {
    deleteCircleModalOpen: boolean;
    setDeleteCircleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    circleId: string;
}

const DeleteCircleModal = (props: DeleteCircleProps) => {
    const navigate = useNavigate();
    const { deleteCircleModalOpen, setDeleteCircleModalOpen, circleId } = props;
    const handleDeleteCircle = () => {
        // send a post request to the backend to join the circle
        // console.log("delete circle", props.circleId);
        fetch(`/api/circles/${circleId}`, {
            method: "DELETE",
            credentials: "include",
        }).then((response) => {
            if (response.ok) {
                navigate("/circle");
            } else {
                alert("Error deleting circle")
            }
        });
    };

    const handleCancel = () => {
        setDeleteCircleModalOpen(false);
    };

    return (
        <Dialog
            open={deleteCircleModalOpen}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{"Delete Circle"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this circle?
                </DialogContentText>
            </DialogContent>
            <Grid
                container
                spacing={3}
                sx={{
                    margin: "auto",
                    width: "80%",
                    // marginTop: "2rem",
                    marginBottom: "2rem",
                }}
            >
                {/* Join or Cancel button, join button sends request for user to join circle, cancel button reroutes to /circles */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleDeleteCircle}
                    >
                        Delete
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default DeleteCircleModal;
