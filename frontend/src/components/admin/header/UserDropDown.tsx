import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from "../../../stores/auth";
import { useNavigate } from "react-router";

const UserDropdown: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logout();
        navigate("/login");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
                onClick={toggleDropdown}
            >
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <FiChevronDown
                    className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-800">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                        </p>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={logoutHandler}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <FiLogOut className="w-4 h-4" />
                            Keluar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
