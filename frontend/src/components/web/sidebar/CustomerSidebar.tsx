import React from 'react';
import { Link, useLocation } from 'react-router';
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiLogOut,
} from 'react-icons/fi';
import Cookies from 'js-cookie';

const CustomerSidebar: React.FC = () => {
  const location = useLocation();
  const userCookie = Cookies.get('user');
  const user = userCookie
    ? JSON.parse(userCookie)
    : { name: 'Pelanggan' };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('permissions');
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-cyan-50 text-cyan-700'
      : 'text-gray-600 hover:bg-gray-50';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="p-6 bg-cyan-500 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <FiUser className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                Selamat Datang,
              </p>
              <p className="font-extrabold truncate max-w-37.5 text-lg">
                {user.name}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${isActive(
                '/dashboard'
              )}`}
            >
              <FiShoppingBag className="w-5 h-5" />
              Riwayat Pesanan
            </Link>

            <Link
              to="/dashboard/addresses"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${isActive(
                '/dashboard/addresses'
              )}`}
            >
              <FiMapPin className="w-5 h-5" />
              Alamat Saya
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <FiLogOut className="w-5 h-5" />
              Keluar
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex items-center gap-3">
          <div className="bg-cyan-100 p-2 rounded-full text-cyan-600">
            <FiUser className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Selamat Datang
            </p>
            <p className="font-bold text-gray-900">
              {user.name}
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            to="/dashboard"
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm border transition-colors ${location.pathname === '/dashboard'
              ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-200'
              : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
              }`}
          >
            <FiShoppingBag
              className={
                location.pathname === '/dashboard'
                  ? 'text-white'
                  : 'text-gray-400'
              }
            />
            Riwayat Pesanan
          </Link>

          <Link
            to="/dashboard/addresses"
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm border transition-colors ${location.pathname === ''
              ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-200'
              : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
              }`}
          >
            <FiMapPin
              className={
                location.pathname === '/dashboard/addresses'
                  ? 'text-white'
                  : 'text-gray-400'
              }
            />
            Alamat Saya
          </Link>

          <button
            onClick={handleLogout}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-white text-red-600 border border-red-50 hover:bg-red-50 transition-colors"
          >
            <FiLogOut />
            Keluar
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerSidebar;