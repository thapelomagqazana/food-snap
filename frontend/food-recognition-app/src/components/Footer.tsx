import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Email, PrivacyTip } from "@mui/icons-material";

/**
 * Footer Component
 *
 * This component renders the footer section of the application. 
 * It includes:
 * - App version information.
 * - Links to the privacy policy and support email.
 *
 * Features:
 * - Simple and clean design.
 * - Responsive layout with Material UI styling.
 * - Icons for enhanced visual representation of links.
 */
const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                // Styling for the footer box
                backgroundColor: "#e0e0e0", // Light gray background
                textAlign: "center", // Center-align all content
                py: 2, // Padding on the y-axis
                mt: 4, // Margin on the top
                borderTop: "1px solid #ccc", // Subtle border at the top
            }}
        >
            {/* Display the app version */}
            <Typography variant="body2" color="textSecondary">
                App version 1.0.0
            </Typography>

            {/* Container for links with icons */}
            <Box display="flex" justifyContent="center" gap={2} mt={1}>
                {/* Privacy Policy Link */}
                <Link href="#" underline="hover" color="inherit">
                    <PrivacyTip sx={{ verticalAlign: "middle", mr: 0.5 }} />
                    Privacy Policy
                </Link>

                {/* Contact Support Link */}
                <Link
                    href="mailto:support@foodtrack.com"
                    underline="hover"
                    color="inherit"
                >
                    <Email sx={{ verticalAlign: "middle", mr: 0.5 }} />
                    Contact Support
                </Link>
            </Box>
        </Box>
    );
};

export default Footer;
