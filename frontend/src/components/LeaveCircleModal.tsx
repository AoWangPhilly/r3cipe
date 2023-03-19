import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface LeaveCircleProps {
    leaveCircleModalOpen: boolean;
    setLeaveCircleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    circleId: string;
}

const LeaveCircleModal = (props: LeaveCircleProps) => {
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext);
    const { leaveCircleModalOpen, setLeaveCircleModalOpen, circleId } = props;
    const handleLeaveCircle = () => {
        // send a post request to the backend to join the circle
        // console.log("leave circle", props.circleId);
        fetch(`/api/circles/${circleId}/members/`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                memberId: userId,
            }),
        }).then((response) => {
            if (response.ok) {
                // console.log("success");
                navigate("/circle");
            } else {
                // console.log("error");
                alert("Error leaving circle");
            }
        });
    };

    const handleCancel = () => {
        setLeaveCircleModalOpen(false);
    };

    return (
        <Dialog
            open={leaveCircleModalOpen}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{"Leave Circle"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to leave this circle?
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
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleLeaveCircle}
                    >
                        Leave
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

export default LeaveCircleModal;
