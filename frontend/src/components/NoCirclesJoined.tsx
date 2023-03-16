import { Typography, Box } from "@mui/material";

const NoCircleJoined = () => {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "2rem",
                background: "#f7f7f7",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                marginTop: "2rem",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    color: "#444444",
                }}
            >
                You haven't joined any circle group yet!
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: "#777777",
                }}
            >
                Join or create a circle group to start sharing your recipes!
            </Typography>
        </Box>
    );
};

export default NoCircleJoined;
