import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "../stores/auth";

// Views
import Login from "../views/auth/Login";
import Register from "../views/auth/Register";
import DashboardPage from "../views/admin/dashboard/Index";
import ProtectedRoute from "../components/guards/ProtectedRoute";

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

      <Route path="/admin">
        {/* ============ ROUTE DASHBOARD ============ */}
        <Route
          path="dashboard"
          element={<ProtectedRoute component={DashboardPage} requiredPermission="dashboard-index" />}
        />
      </Route>
    </Routes>
  );
}
