import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#090d13] text-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                    <p className="text-sm text-slate-400">Verifying session...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
