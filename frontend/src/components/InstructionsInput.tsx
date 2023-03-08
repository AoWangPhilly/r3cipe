import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
    Button,
    Box,
    Grid,
    Typography,
    IconButton,
    Icon,
    FormControl,
} from "@mui/material";
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
const SubmittedInstruction = (props: {
    instruction: string;
    instructions: string[];
    setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    const { instructions, setInstructions } = props;
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
                <Typography>
                    {instructions.indexOf(props.instruction) + 1}:{"\t"}
                    {props.instruction}
                </Typography>
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

const AddInstruction = (props: {
    formState: FormState;
    addInstructionOnClick: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const { formState, addInstructionOnClick, handleInputChange } = props;
    return (
        <Grid
            container
            spacing={2}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
            }}
        >
            <Grid item display="flex" width={"80%"}>
                <TextField
                    name="instruction"
                    variant="outlined"
                    fullWidth
                    id="instruction"
                    label="Instruction"
                    value={formState.instruction}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && formState.instruction !== "") {
                            addInstructionOnClick();
                        }
                    }}
                />
            </Grid>
            <Grid item display="flex" width={"20%"}>
                <IconButton onClick={addInstructionOnClick} color={"primary"}>
                    <AddIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
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
                width: "85%",
            }}
        >
            <Typography variant="h6">Instructions</Typography>
            {instructions.map((instruction) => (
                <SubmittedInstruction
                    key={instruction + Math.random()}
                    instruction={instruction}
                    instructions={instructions}
                    setInstructions={setInstructions}
                />
            ))}
            <AddInstruction
                formState={formState}
                addInstructionOnClick={addInstructionOnClick}
                handleInputChange={handleInputChange}
            />
        </Box>
    );
};
