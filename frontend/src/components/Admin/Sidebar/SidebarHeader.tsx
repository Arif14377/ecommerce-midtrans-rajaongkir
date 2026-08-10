import React from 'react';
import { useLayoutStore } from '../../../stores/layout';

const SidebarHeader: React.FC = () => {
  const { sidebarOpen, isMobile, toggleSidebar } = useLayoutStore();

  return (
    <div className="h-14 px-4 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center">
          <img
            src="/tokokita.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        {sidebarOpen && (
          <span className="text-gray-800 font-semibold text-base">
            TokoKita
          </span>
        )}
      </div>

      {isMobile && sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
