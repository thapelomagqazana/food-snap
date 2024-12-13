import React, { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Background Component
 * 
 * This component provides a visually appealing background for the application.
 * It uses a gradient overlay on top of a background image to enhance readability
 * while ensuring the UI remains aesthetically pleasing.
 * 
 * Props:
 * - `children`: ReactNode - The child components to be rendered inside the background container.
 * 
 * Styling:
 * - A linear gradient overlay ensures text readability against the background image.
 * - Full viewport height (`minHeight: "100vh"`) makes it suitable as a container for full-page layouts.
 * - Flexbox layout to position children elements effectively.
 * - Color is set to white (`#fff`) to ensure text and components are visible.
 * 
 * @param {ReactNode} children - The child components to render inside the background.
 * @returns {JSX.Element} The styled background container.
 */
interface BackgroundProps {
    children: ReactNode; // Allows React elements as children.
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
    return (
        // Box serves as a container with background styling.
        <Box
            sx={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/healthy-foods.jpg')",
                backgroundSize: "cover", // Ensures the image covers the entire container.
                backgroundPosition: "center", // Centers the background image.
                minHeight: "100vh", // Full viewport height for a complete page layout.
                display: "flex", // Flexbox layout for positioning child elements.
                flexDirection: "column", // Aligns children vertically.
                justifyContent: "space-between", // Distributes children with space between them.
                color: "#fff", // White text color for contrast against the dark overlay.
            }}
        >
            {children} {/* Renders child components passed to the Background */}
        </Box>
    );
};

export default Background;
