import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiSearch,
} from "react-icons/fi";
import { useLayoutStore } from "../../../stores/layout";
import MenuMobile from "./MenuMobile";
import SearchModal from "../search/SearchModal";
import { useGetCart } from "../../../hooks/web/cart/useGetCart";
import { useAuthStore } from "../../../stores/auth";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const { toggleDrawer } = useLayoutStore();
  const location = useLocation();
  const { token, user } = useAuthStore();
  const isAuthenticated = !!token;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("permissions");
    window.location.href = "/login";
  };

  const getDashboardLink = () => {
    const roles = user?.roles || [];
    const isCustomerOnly =
      roles.length === 0 ||
      (roles.length === 1 && roles.includes("user"));

    return isCustomerOnly ? "/dashboard" : "/admin/dashboard";
  };

  const navLinks = [
    { path: "/", label: "Beranda" },
    { path: "#", label: "Produk" },
    { path: "#", label: "Kategori" },
    { path: "#", label: "Tentang" },
    { path: "#", label: "Kontak" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const { data: cartData } = useGetCart();
  const cartCount = cartData?.data
    ? cartData.data.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
    : 0;

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://is3.cloudhost.id/kodemastery/tokokita.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-800">
                TokoKita
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={label}
                  to={path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(path)
                      ? "text-cyan-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setIsDropdownOpen(!isDropdownOpen)
                    }
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg"
                  >
                    <FiUser className="w-4 h-4" />
                    {user?.name?.split(" ")[0] || "Dashboard"}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-semibold truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg"
                >
                  <FiUser className="w-4 h-4" />
                  Masuk
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={toggleDrawer}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MenuMobile />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;