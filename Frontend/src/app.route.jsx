import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./Features/auth/pages/Login.jsx";
import Register from "./Features/auth/pages/Register.jsx";
import ProtectedRoute from "./Features/auth/Components/ProtectedRoute.jsx";
import Home from "./Features/interview/Pages/Home.jsx";
import InterviewReport from "./Features/interview/Pages/InterviewReport.jsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
    },
    {
        path: "/interview/:interviewId",
        element: (
            <ProtectedRoute>
                <InterviewReport />
            </ProtectedRoute>
        )
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);