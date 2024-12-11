import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Email } from "@mui/icons-material";


const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#e0e0e0",
                textAlign: "center",
                py: 2,
                mt: 4,
                borderTop: "1px solid #ccc",
            }}
        >
            <Typography variant="body2" color="textSecondary">
                App version 1.0.0
            </Typography>
            <Link href="#" underline="hover" color="inherit" sx={{ mx: 1 }}>
                Privacy Policy
            </Link>
            <Link href="mailto:support@foodtrack.com" underline="hover" color="inherit">
                <Email sx={{ verticalAlign: "middle", mr: 0.5 }} />
                Contact Support
            </Link>
        </Box>
    );
};

export default Footer;