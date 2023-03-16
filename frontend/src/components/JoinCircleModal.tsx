import { Button, Dialog, DialogContentText, DialogTitle, Grid } from "@mui/material"
import { useNavigate } from "react-router-dom";


interface JoinCircleProps {
    joinCircleModalOpen: boolean;
    circleId: string;
}

const JoinCircleModal = (props: JoinCircleProps) => {

    const navigate = useNavigate();
    const { joinCircleModalOpen, circleId } = props;
    const handleJoinCircle = () => {
        // send a post request to the backend to join the circle
        console.log("join circle", props.circleId);
        fetch(`/api/circles/${circleId}`,
            {
                method: "PUT",
                credentials: "include",
                }
                ).then((response) => {
                    if (response.ok) {
                        console.log("success");
                        navigate(0);
                    } else {
                        console.log("error");
                    }
                })
    }

    const handleCancel = () => {
        // navigate to the circles page
        navigate("/circle");
    }

    return (
        <Dialog
            open={joinCircleModalOpen}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{"Join Circle"}</DialogTitle>
            <DialogContentText id="alert-dialog-description">
                You have been invited to join a circle. Would you like to join?
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
                {/* Join or Cancel button, join button sends request for user to join circle, cancel button reroutes to /circles */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleJoinCircle}
                    >
                        Join
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
    )

}

export default JoinCircleModal