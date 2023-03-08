import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
} from "@mui/material";

interface PantryModalProps {
    pantryOpen: boolean;
    handlePantryClose: () => void;
}

const PantryModal = (props: PantryModalProps) => {
    const { pantryOpen, handlePantryClose } = props;

    return (
        <Dialog
            open={pantryOpen}
            onClose={handlePantryClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={"lg"}
        >
            <DialogTitle id="alert-dialog-title">{"Pantry"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {/* Pantry Add Stuff */}
                    <Button variant="contained" color="primary">
                        Save Pantry
                    </Button>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};

export default PantryModal;
