import React from "react";
import { Link } from "react-router";
import {
  FiHome,
  FiBox,
  FiGrid,
  FiInfo,
  FiPhone,
  FiX,
  FiUser,
} from "react-icons/fi";
import { useLayoutStore } from "../../../stores/layout";
import { useAuthStore } from "../../../stores/auth";

const navLinks = [
  { path: "/", label: "Beranda", icon: FiHome },
  { path: "#", label: "Produk", icon: FiBox },
  { path: "#", label: "Kategori", icon: FiGrid },
  { path: "#", label: "Tentang", icon: FiInfo },
  { path: "#", label: "Kontak", icon: FiPhone },
];

const MenuMobile: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useLayoutStore();
  const { token, user } = useAuthStore();
  const isAuthenticated = !!token;

  const getDashboardLink = () => {
    if (user?.roles?.includes("user")) {
      return "/dashboard";
    }
    return "/admin/dashboard";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${
          isDrawerOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-800">
            Menu
          </span>
          <button
            onClick={toggleDrawer}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <li key={label}>
                <Link
                  to={path}
                  onClick={toggleDrawer}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              onClick={toggleDrawer}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl"
            >
              <FiUser className="w-5 h-5" />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={toggleDrawer}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg"
            >
              <FiUser className="w-5 h-5" />
              Masuk / Daftar
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuMobile;