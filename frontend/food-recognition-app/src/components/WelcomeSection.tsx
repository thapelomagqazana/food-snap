import React from "react";
import { Box, Typography } from "@mui/material";

const WelcomeSection: React.FC = () => {
    return (
        <Box
            textAlign="center"
            py={4}
            sx={{ backgroundColor: "#f1f8e9", color: "#33691e" }}
        >
            <Typography variant="h4" fontWeight="bold">
                Welcome to the Food Recognition App!
            </Typography>
            <Typography variant="body1" mt={2}>
                Easily recognize your meals, track your nutrition, and achieve your health goals.
            </Typography>
        </Box>
    );
};

export default WelcomeSection;