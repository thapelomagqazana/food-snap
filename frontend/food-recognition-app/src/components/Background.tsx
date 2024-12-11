import React, { ReactNode } from "react";
import { Box } from "@mui/material";

// Define the props type
interface BackgroundProps {
    children: ReactNode; // Allows React elements as children
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
    return (
        <Box
            sx={{
                backgroundImage: "url('/healthy-foods.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {children}
        </Box>
    );
};

export default Background;