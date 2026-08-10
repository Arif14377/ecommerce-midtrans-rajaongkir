import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiPackage } from 'react-icons/fi';
import { useNotificationStore } from '../../../stores/notification';
import { Link } from 'react-router';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,
    isConnected
  } = useNotificationStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      >
        <FiBell className="w-5 h-5" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Connection indicator */}
        <span
          className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-gray-300'
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800">
              Notifikasi
            </h3>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-cyan-600 hover:text-cyan-700 cursor-pointer"
                >
                  Tandai dibaca
                </button>
              )}

              {notifications.some((n) => n.read) && (
                <button
                  onClick={clearReadNotifications}
                  className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                >
                  Hapus dibaca
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <FiBell className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={`/admin/orders/${notification.order_id}`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-cyan-50/50' : ''
                  }`}
                >
                  <div className="shrink-0 w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-4 h-4 text-cyan-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      Pesanan Baru
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {notification.customer} –{' '}
                      {formatPrice(notification.total_price)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.read && (
                    <span className="shrink-0 w-2 h-2 bg-cyan-500 rounded-full mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <Link
                to="/admin/orders"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs text-cyan-600 hover:text-cyan-700"
              >
                Lihat semua pesanan
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
