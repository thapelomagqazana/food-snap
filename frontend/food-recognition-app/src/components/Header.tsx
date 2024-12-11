import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header: React.FC = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#2e7d32" }}>
            <Toolbar>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="h5" component="div" fontWeight="bold">
                        FoodTrack
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#dcedc8" }}>
                        Your Nutrition Companion
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;