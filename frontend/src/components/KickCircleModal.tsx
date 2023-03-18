import {
    Button,
    Dialog,
    DialogContentText,
    DialogTitle,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface KickCircleProps {
    kickCircleModalOpen: boolean;
    setKickCircleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    circleId: string;
    user: {
        _id: string;
        name: string;
    };
}

const KickCircleModal = (props: KickCircleProps) => {
    const navigate = useNavigate();
    const { kickCircleModalOpen, setKickCircleModalOpen, circleId, user } = props;
    const handleKickCircle = () => {
        // send a post request to the backend to join the circle
        console.log("kick circle", props.circleId);
        console.log("kick user", user._id);
        fetch(`/api/circles/${circleId}/members`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                memberId: user._id,
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("success");
                navigate(0);
            } else {
                console.log("error");
            }
        });
    };

    const handleCancel = () => {
        setKickCircleModalOpen(false);
    };

    return (
        <Dialog
            open={kickCircleModalOpen}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">
                {"Kick user from circle"}
            </DialogTitle>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to kick this circle?
            </DialogContentText>
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
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleKickCircle}
                    >
                        Kick
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
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

export default KickCircleModal;
