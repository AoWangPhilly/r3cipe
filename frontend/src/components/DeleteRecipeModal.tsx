import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface DeleteRecipeProps {
    deleteRecipeModalOpen: boolean;
    setDeleteRecipeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    recipeId: string;
}

const DeleteRecipeModal = (props: DeleteRecipeProps) => {
    const navigate = useNavigate();
    const { deleteRecipeModalOpen, setDeleteRecipeModalOpen, recipeId } = props;
    const handleDeleteRecipe = () => {
        fetch(`/api/user/recipes/${recipeId}`, {
            method: "DELETE",
            credentials: "include",
        }).then((response) => {
            if (response.ok) {
                navigate("/library");
            } else {
                alert("Error deleting recipe");
            }
        });
    };

    const handleCancel = () => {
        setDeleteRecipeModalOpen(false);
    };

    return (
        <Dialog
            open={deleteRecipeModalOpen}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{"Delete Recipe"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this recipe?
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
                {/* Join or Cancel button, join button sends request for user to join recipe, cancel button reroutes to /recipes */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleDeleteRecipe}
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

export default DeleteRecipeModal;
