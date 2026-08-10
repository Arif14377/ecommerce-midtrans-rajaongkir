// Import React dan hook useEffect
import React, { useEffect } from 'react';

// Import store untuk manajemen state layout
import { useLayoutStore } from '../stores/layout';

// Import component sidebar dan header
import Sidebar from '../components/admin/sidebar/Sidebar';
import Header from '../components/admin/header/Header';

// Import WebSocket hook untuk notifikasi real-time
import { useWebSocket } from '../hooks/useWebSocket';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { sidebarOpen, isMobile, setMobile, toggleSidebar } = useLayoutStore();

  useWebSocket();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setMobile(mobile);
      if (!mobile) useLayoutStore.setState({ sidebarOpen: true });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => useLayoutStore.setState({ sidebarOpen: false })}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;