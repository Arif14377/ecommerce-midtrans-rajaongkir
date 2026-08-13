import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "../stores/auth";

// Views
import Login from "../views/auth/Login";
import Register from "../views/auth/Register";
import DashboardPage from "../views/admin/dashboard/Index";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import SlidersIndex from "../views/admin/sliders/Index";
import SliderCreate from "../views/admin/sliders/Create";
import CategoriesIndex from "../views/admin/categories/Index";
import CategoryCreate from "../views/admin/categories/Create";
import CategoryEdit from "../views/admin/categories/Edit";
import ProductsIndex from "../views/admin/products/Index";
import ProductCreate from "../views/admin/products/Create";
import ProductEdit from "../views/admin/products/Edit";
import CustomersIndex from "../views/admin/customers/Index";
import ReportsIndex from "../views/admin/reports/Index";
import PermissionsIndex from "../views/admin/permissions/Index";
import PermissionCreate from "../views/admin/permissions/Create";
import PermissionEdit from "../views/admin/permissions/Edit";

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

        {/* ============ ROUTE CATEGORIES ============ */}
        <Route path="categories">
          {/* Route Index - permission categories-index */}
          <Route
            index
            element={<ProtectedRoute component={CategoriesIndex} requiredPermission="categories-index" />}
          />

          {/* Route Create - permission categories-create */}
          <Route
            path="create"
            element={<ProtectedRoute component={CategoryCreate} requiredPermission="categories-create" />}
          />

          {/* Route Edit - permission categories-edit */}
          <Route
            path="edit/:id"
            element={<ProtectedRoute component={CategoryEdit} requiredPermission="categories-edit" />}
          />
        </Route>

        {/* ============ ROUTE PRODUCTS ============ */}
        <Route path="products">
          {/* Route Index - permission products-index */}
          <Route
            index
            element={<ProtectedRoute component={ProductsIndex} requiredPermission="products-index" />}
          />

          {/* Route Create - permission products-create */}
          <Route
            path="create"
            element={<ProtectedRoute component={ProductCreate} requiredPermission="products-create" />}
          />

          {/* Route Edit - permission products-edit */}
          <Route
            path="edit/:id"
            element={<ProtectedRoute component={ProductEdit} requiredPermission="products-edit" />}
          />
        </Route>

        {/* ============ ROUTE CUSTOMERS ============ */}
        <Route path="customers">
          {/* Route Index - permission customers-index */}
          <Route
            index
            element={<ProtectedRoute component={CustomersIndex} requiredPermission="customers-index" />}
          />
        </Route>
        {/* ============ ROUTE REPORTS ============ */}
        <Route path="reports">
          <Route 
            index 
            element={<ProtectedRoute component={ReportsIndex} requiredPermission="reports-index" />} 
          />
        </Route>

        {/* ============ ROUTE PERMISSIONS ============ */}
        <Route path="permissions">
          {/* Route Index - permission permissions-index */}
          <Route
            index
            element={<ProtectedRoute component={PermissionsIndex} requiredPermission="permissions-index" />}
          />

          {/* Route Create - permission permissions-create */}
          <Route
            path="create"
            element={<ProtectedRoute component={PermissionCreate} requiredPermission="permissions-create" />}
          />

          {/* Route Edit - permission permissions-edit */}
          <Route
            path="edit/:id"
            element={<ProtectedRoute component={PermissionEdit} requiredPermission="permissions-edit" />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
