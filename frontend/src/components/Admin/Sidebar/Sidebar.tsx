import React from 'react';
import { useLayoutStore } from '../../../stores/layout';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';

const Sidebar: React.FC = () => {
  const { sidebarOpen, isMobile } = useLayoutStore();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-out w-[220px]
        ${isMobile
          ? sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          : 'translate-x-0 lg:static'
        }`}
      >
        {/* Header */}
        <SidebarHeader />

        {/* Menu */}
        <SidebarMenu />
      </aside>
    </>
  );
};

export default Sidebar;