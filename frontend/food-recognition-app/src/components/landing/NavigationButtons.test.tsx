import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NavigationButtons from "./NavigationButtons";

// Mock components for navigation testing
const MockRegisterPage = () => <div>Register Page</div>;
// const MockLoginPage = () => <div>Login Page</div>;
// const MockExplorePage = () => <div>Explore Page</div>;

describe("NavigationButtons Component", () => {
    test("renders all buttons with correct text and icons", () => {
        render(
            <MemoryRouter>
                <NavigationButtons />
            </MemoryRouter>
        );

        // Assert buttons exist
        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /explore as guest/i })).toBeInTheDocument();

        // Assert icons exist
        expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
        expect(screen.getByTestId("KeyIcon")).toBeInTheDocument();
        expect(screen.getByTestId("SearchIcon")).toBeInTheDocument();
    });

    test("navigates to the Register page when 'Register' button is clicked", async () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<NavigationButtons />} />
                    <Route path="/register" element={<MockRegisterPage />} />
                </Routes>
            </MemoryRouter>
        );

        const registerButton = screen.getByRole("button", { name: /register/i });
        await userEvent.click(registerButton);

        expect(screen.getByText(/register page/i)).toBeInTheDocument();
    });

    // test("navigates to the Log In page when 'Log In' button is clicked", async () => {
    //     render(
    //         <MemoryRouter initialEntries={["/"]}>
    //             <Routes>
    //                 <Route path="/" element={<NavigationButtons />} />
    //                 <Route path="/login" element={<MockLoginPage />} />
    //             </Routes>
    //         </MemoryRouter>
    //     );

    //     const loginButton = screen.getByRole("button", { name: /log in/i });
    //     await userEvent.click(loginButton);

    //     expect(screen.getByText(/login page/i)).toBeInTheDocument();
    // });

    // test("navigates to the Explore as Guest page when 'Explore as Guest' button is clicked", async () => {
    //     render(
    //         <MemoryRouter initialEntries={["/"]}>
    //             <Routes>
    //                 <Route path="/" element={<NavigationButtons />} />
    //                 <Route path="/explore" element={<MockExplorePage />} />
    //             </Routes>
    //         </MemoryRouter>
    //     );

    //     const exploreButton = screen.getByRole("button", { name: /explore as guest/i });
    //     await userEvent.click(exploreButton);

    //     expect(screen.getByText(/explore page/i)).toBeInTheDocument();
    // });
});
