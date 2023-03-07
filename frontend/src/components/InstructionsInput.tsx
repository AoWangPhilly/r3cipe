import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Box, Grid, Typography, IconButton, Icon } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Ingredient } from "../types";
import { useState, useEffect } from "react";

interface InstructionsInputProps {
    instructions: string[];
    setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
}

type FormState = {
    instruction: string;
};
export const InstructionsInput = (props: InstructionsInputProps) => {
    const [formState, setFormState] = useState<FormState>({
        instruction: "",
    });

    const { instructions, setInstructions } = props;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addInstructionOnClick = () => {
        const instruction = formState.instruction;
        if (instruction === "") {
            return;
        }
        setInstructions([...instructions, instruction]);
        setFormState({ instruction: "" });
    };

    const SubmittedInstruction = (props: { instruction: string }) => {
        return (
            <Grid
                container
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    border: "1px solid black",
                    borderRadius: "5px",
                    padding: "5px",
                    margin: "5px",
                    justifyContent: "space-between",
                }}
            >
                <Grid item display="flex">
                    <Typography>{props.instruction}</Typography>
                </Grid>
                <Grid item display="flex">
                    <IconButton
                        color="error"
                        onClick={() => {
                            setInstructions(
                                instructions.filter(
                                    (instruction) =>
                                        instruction !== props.instruction
                                )
                            );
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    };

    const AddInstruction = () => {
        return (
            <Grid
                container
                spacing={2}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Grid item display="flex">
                    <TextField
                        name="instruction"
                        variant="outlined"
                        required
                        fullWidth
                        autoFocus
                        id="instruction"
                        sx={{ width: 700 }}
                        label="Instruction"
                        value={formState.instruction}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addInstructionOnClick();
                            }
                        }}
                    />
                </Grid>
                <Grid item display="flex">
                    <IconButton
                        onClick={addInstructionOnClick}
                        color={"primary"}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid black",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
                width: "40%",
            }}
        >
            <Typography variant="h6">Instructions</Typography>
            {instructions.map((instruction) => (
                <SubmittedInstruction
                    key={instruction}
                    instruction={instruction}
                />
            ))}
            <AddInstruction />
        </Box>
    );
};
