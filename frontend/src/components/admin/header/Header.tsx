import React from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../../../stores/auth';
import UserDropdown from './UserDropDown';
import Input from '../../general/Input';
import NotificationDropdown from './NotificationDropDown';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-800">
              Halo, {user?.name || 'Admin'} 👋
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <Input
              startIcon={<FiSearch className="w-4 h-4 text-gray-400" />}
              placeholder="Cari..."
              className="w-48 lg:w-64"
              inputClassName="bg-gray-50"
            />
          </div>

          {/* Notification */}
          <NotificationDropdown />

          {/* Mobile user name */}
          <span className="sm:hidden text-sm font-medium text-gray-700 truncate max-w-30">
            Hi, {user?.name?.split(' ')[0] || 'Admin'}
          </span>

          {/* User dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
