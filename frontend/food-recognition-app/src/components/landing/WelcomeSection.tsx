import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * WelcomeSection Component
 * 
 * This component displays a welcoming message to the user, introducing them to the app
 * and its core value proposition. It's styled to be visually engaging and centered on the page.
 * 
 * Purpose:
 * - Provides a welcoming and user-friendly introduction to the application.
 * - Highlights the app's purpose with a concise and appealing message.
 * 
 * Styling:
 * - Center-aligned text for readability and focus.
 * - Soft background color (`#f9fbe7`) with rounded corners to make the design approachable.
 * - A subtle box-shadow adds depth, giving the section a card-like appearance.
 * - Responsive design with `maxWidth` and `margin` ensures it adapts well to different screen sizes.
 * 
 * @returns {JSX.Element} The styled welcome section.
 */
const WelcomeSection: React.FC = () => {
    return (
        // Box container for the welcome message with customized styling.
        <Box
            textAlign="center" // Aligns text to the center.
            py={4} // Adds vertical padding for spacing.
            px={3} // Adds horizontal padding for spacing.
            sx={{
                backgroundColor: "#f9fbe7", // Light background color for a friendly feel.
                color: "#33691e", // Dark green text color for contrast and a natural theme.
                borderRadius: "10px", // Rounded corners for a soft, modern design.
                maxWidth: "600px", // Limits width to ensure content is easy to read.
                margin: "2rem auto", // Centers the component on the page.
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth.
            }}
        >
            {/* Main headline welcoming the user */}
            <Typography variant="h4" fontWeight="bold">
                Welcome to the Food Recognition App!
            </Typography>
            
            {/* Subheading explaining the app's purpose */}
            <Typography variant="body1" mt={2}>
                Easily recognize your meals, track your nutrition, and achieve your health goals.
            </Typography>
        </Box>
    );
};

export default WelcomeSection;
