import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const SignInSignUp = lazy(() => import('./components/SignInSignUp'));
const HomeScreen = lazy(() => import('./components/HomeScreen'));
const RegistrationScreen = lazy(() => import('./components/RegistrationScreen'));
const OnboardingScreen = lazy(() => import('./components/OnboardingScreen'));
const FoodRecognitionScreen = lazy(() => import('./components/FoodRecognitionScreen'));
const ResultsScreen = lazy(() => import('./components/ResultsScreen'));
const DailyLogsScreen = lazy(() => import('./components/DailyLogsScreen'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));


import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin-signup" replace />;
};

const App: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
    );
};

export default App;

