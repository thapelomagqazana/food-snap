import React from "react";
import { Box, Button } from "@mui/material";
import { Person, Key, Search } from "@mui/icons-material";

const NavigationButtons: React.FC = () => {
    return (
        <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button
                variant="contained"
                color="success"
                startIcon={<Person />}
                sx={{ borderRadius: "20px", textTransform: "none" }}
            >
                Register
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Key />}
                sx={{ borderRadius: "20px", textTransform: "none" }}
            >
                Log In
            </Button>
            <Button
                variant="contained"
                color="warning"
                startIcon={<Search />}
                sx={{ borderRadius: "20px", textTransform: "none" }}
            >
                Explore as Guest
            </Button>
        </Box>
    );
};

export default NavigationButtons;