import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "../stores/auth";

// Views
import Login from "../views/auth/Login";
import Register from "../views/auth/Register";
import DashboardPage from "../views/admin/dashboard/Index";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import SlidersIndex from "../views/admin/sliders/Index";
import SliderCreate from "../views/admin/sliders/Create";

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

      {/* ============ ROUTES ADMIN ============ */}
      <Route path="/admin">
        {/* ============ ROUTE DASHBOARD ============ */}
        <Route
          path="dashboard"
          element={<ProtectedRoute component={DashboardPage} requiredPermission="dashboard-index" />}
        />

        {/* ============ ROUTE SLIDERS ============ */}
        <Route path="sliders">
          {/* Route Index - permission sliders-index */}
          <Route
            index
            element={<ProtectedRoute component={SlidersIndex} requiredPermission="sliders-index" />}
          />

          {/* Route Create - permission sliders-create */}
          <Route 
            path="create" 
            element={<ProtectedRoute component={SliderCreate} requiredPermission="sliders-create" />} 
          />
        </Route>
      </Route>
    </Routes>
  );
}
