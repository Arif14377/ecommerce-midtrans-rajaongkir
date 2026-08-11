import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "../stores/auth";

// Views
import Login from "../views/auth/Login";

// Membuat route login
export default function AppRoutes() {
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* ============ ROUTE LOGIN ============ */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
    </Routes>
  );
}