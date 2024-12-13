import React from "react";
import { Box, Button } from "@mui/material";
import { Person, Key, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * NavigationButtons Component
 * 
 * This component provides three main navigation options for the user:
 * - Register: Navigate to the registration page.
 * - Log In: Navigate to the login page.
 * - Explore as Guest: Allows users to access the app without signing in.
 * 
 * Purpose:
 * - Serves as the primary action buttons on the Home Screen.
 * - Enhances user experience with intuitive icons, colors, and hover effects.
 * 
 * Styling:
 * - Rounded buttons (`borderRadius: "20px"`) for a modern look.
 * - Distinct colors for each action:
 *   - Green for "Register" (signifying action and growth).
 *   - Blue for "Log In" (indicating trust and security).
 *   - Orange for "Explore" (representing discovery and optionality).
 * - Hover effects for visual feedback and engagement.
 * 
 * @returns {JSX.Element} Navigation buttons with actions.
 */
const NavigationButtons: React.FC = () => {
    const navigate = useNavigate(); // React Router hook for navigation.

    return (
        <Box 
            display="flex" // Aligns buttons horizontally.
            justifyContent="center" // Centers buttons in the container.
            gap={2} // Adds spacing between buttons.
            mt={4} // Adds top margin for spacing.
        >
            {/* Register Button */}
            <Button
                variant="contained"
                color="success"
                startIcon={<Person data-testid="PersonIcon" />} // Icon representing a user.
                sx={{
                    borderRadius: "20px", // Rounded edges for modern styling.
                    textTransform: "none", // Keeps button text in normal casing.
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth.
                    "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }, // Enhanced shadow on hover.
                }}
                onClick={() => navigate('/register')} // Navigates to the Register page.
            >
                Register
            </Button>

            {/* Log In Button */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<Key data-testid="KeyIcon" />} // Icon representing a key (log in).
                sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" },
                }}
                onClick={() => navigate('/login')} // Navigates to the Log In page.
            >
                Log In
            </Button>

            {/* Explore as Guest Button */}
            <Button
                variant="contained"
                color="warning"
                startIcon={<Search data-testid="SearchIcon" />} // Icon representing exploration.
                sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" },
                }}
                onClick={() => navigate('/explore')} // Navigates to the guest exploration page.
            >
                Explore as Guest
            </Button>
        </Box>
    );
};

export default NavigationButtons;
