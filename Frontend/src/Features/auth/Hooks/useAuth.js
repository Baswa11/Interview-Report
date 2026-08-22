import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout } from "../../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login(email, password);
            setUser(data.user);
            return data;
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register(username, email, password);
            setUser(data.user);
            return data;
        } catch (err) {
            console.error("Registration failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            const data = await logout();
            setUser(null);
            return data;
        } catch (err) {
            console.error("Logout failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout
    };
};   