import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "../stores/auth";

// Views
import Login from "../views/auth/Login";
import Register from "../views/auth/Register";

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

      {/* ============ ROUTE REGISTER ============ */}
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
    </Routes>
  );
}