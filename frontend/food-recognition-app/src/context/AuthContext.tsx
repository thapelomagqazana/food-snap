import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


// Define types
interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}
  
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("authToken") || null);
    const navigate = useNavigate();

    // Function to decode and check token expiration
    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded: any = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true; // Assume expired if decoding fails
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        navigate("/login"); // Redirect to login
    };

    const login = (newToken: string) => {
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        setupAutoLogout(newToken); // Setup auto logout based on expiry
    };

    // Automatically log out when the token expires
    const setupAutoLogout = (token: string) => {
        const decoded: any = jwtDecode(token);
        const expiresIn = decoded.exp * 1000 - Date.now();
        if (expiresIn > 0) {
        setTimeout(() => {
            logout();
        }, expiresIn);
        } else {
        logout();
        }
    };

    useEffect(() => {
        if (token) {
          if (isTokenExpired(token)) {
            logout();
          } else {
            setupAutoLogout(token);
          }
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};