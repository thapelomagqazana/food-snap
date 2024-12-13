import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

/**
 * Header Component
 * 
 * This component renders the header bar for the application. 
 * It includes the app's name ("FoodTrack") and a subtitle ("Your Nutrition Companion").
 * 
 * Styling and UX Enhancements:
 * - Green-themed AppBar with a shadow for visual depth.
 * - App name and tagline are centrally aligned for symmetry and balance.
 * - Subtitle styled with a subtle, lighter green to complement the header theme.
 * 
 * @returns {JSX.Element} The header component.
 */
const Header: React.FC = () => {
    return (
        // AppBar provides a styled application header with a shadow for depth.
        <AppBar 
            position="static" 
            sx={{ 
                backgroundColor: "#2e7d32", // Green color for the header bar.
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow effect.
            }}
        >
            <Toolbar>
                {/* Box used for layout alignment: center-aligns content horizontally and vertically */}
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center"
                    width="100%" // Ensures content spans the full width of the header.
                >
                    {/* App name displayed prominently */}
                    <Typography 
                        variant="h5" 
                        color="white" 
                        fontWeight="bold"
                    >
                        FoodTrack
                    </Typography>
                    {/* Subtitle provides context about the app */}
                    <Typography 
                        variant="subtitle2" 
                        sx={{ 
                            color: "#c8e6c9", // Light green for contrast.
                            fontSize: "0.9rem", // Slightly smaller text for subtleness.
                            mt: 0.5, // Adds space between title and subtitle.
                        }}
                    >
                        Your Nutrition Companion
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
