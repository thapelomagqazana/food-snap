import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import SignInSignUp from './components/SignInSignUp';
import HomeScreen from "./components/HomeScreen";
import RegistrationScreen from "./components/RegistrationScreen";
import OnboardingScreen from './components/OnboardingScreen';
import FoodRecognitionScreen from './components/FoodRecognitionScreen';
import ResultsScreen from './components/ResultsScreen';
import DailyLogsScreen from './components/DailyLogsScreen';
import ProfileScreen from './components/ProfileScreen';

import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin-signup" replace />;
};

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/signin-signup" element={<SignInSignUp />} />
            <Route path="/register" element={<RegistrationScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
            <Route path="/food-recognition" element={<ProtectedRoute><FoodRecognitionScreen /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsScreen /></ProtectedRoute>} />
            <Route path="/daily-logs" element={<ProtectedRoute><DailyLogsScreen /></ProtectedRoute>} />   
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />   
        </Routes>
    );
};

export default App;



// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import RegistrationPage from "./pages/RegistrationPage";
// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import ProfilePage from "./pages/ProfilePage";
// import HomePage from "./pages/HomePage";
// import ImageAnalysisPage from "./pages/ImageAnalysisPage";

// import Header from "./components/utils/Header";
// import Footer from "./components/utils/Footer";
// import EmailVerification from "./components/register/EmailVerification";
// import NutritionalOverview from "./components/results/NutritionalOverview";

// import { useAuth } from "./context/AuthContext";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { token } = useAuth();
//   return token ? children : <Navigate to="/login" replace />;
// };

// const App: React.FC = () => {
//   return (
//     <div className="app-container">
//       <Header />
//         <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/register" element={<RegistrationPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/verify-email" element={<EmailVerification />} />
//             <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
//             <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
//             <Route path="/analysis" element={<ProtectedRoute><ImageAnalysisPage /></ProtectedRoute>} />
//             <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
//             <Route path="/nutrition-overview" element={<ProtectedRoute><NutritionalOverview /></ProtectedRoute>} />
//         </Routes>
//       <Footer />
//     </div>
//   );
// };

// export default App;
