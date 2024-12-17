import axios from "axios";
import { useAuth } from "./context/AuthContext";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Automatically add token to requests
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors and log out
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const { logout } = useAuth(); // Get logout function
        logout();
      }
      return Promise.reject(error);
    }
);
  
export default apiClient;