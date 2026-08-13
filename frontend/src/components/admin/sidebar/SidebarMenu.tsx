import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import {FiHome, FiChevronDown, FiImage, FiTag, FiBox,  FiUsers, FiBarChart2, FiSettings} from 'react-icons/fi';
import { useLayoutStore } from '../../../stores/layout';
import { usePermission } from '../../../hooks/usePermission';

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  permission?: string;
  children?: { name: string; path: string; permission?: string }[];
}

const mainMenuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: <FiHome />,
    permission: 'dashboard-index',
  },
  {
    name: 'Sliders',
    path: '/admin/sliders',
    icon: <FiImage />,
    permission: 'sliders-index',
  },
  {
    name: 'Categories',
    path: '/admin/categories',
    icon: <FiTag />,
    permission: 'categories-index',
  },
  {
    name: 'Products',
    path: '/admin/products',
    icon: <FiBox />,
    permission: 'products-index',
  },
  {
    name: 'Customers',
    path: '/admin/customers',
    icon: <FiUsers />,
    permission: 'customers-index',
  },
  {
    name: 'Laporan',
    path: '/admin/reports',
    icon: <FiBarChart2 />,
    permission: 'reports-index',
  },
  {
    name: 'Pengaturan',
    icon: <FiSettings />,
    children: [
      {
        name: 'Permissions',
        path: '/admin/permissions',
        permission: 'permissions-index',
      },
      {
        name: 'Roles',
        path: '/admin/roles',
        permission: 'roles-index',
      },
      {
        name: 'Users',
        path: '/admin/users',
        permission: 'users-index',
      },
    ],
  },
];

const SidebarMenu: React.FC = () => {
  const { sidebarOpen, isMobile, toggleSidebar } = useLayoutStore();
  const { hasPermission } = usePermission();
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    const activeMenus = mainMenuItems
      .filter(item =>
        item.children?.some(child =>
          location.pathname.startsWith(child.path)
        )
      )
      .map(item => item.name);

    return Array.from(new Set(['Home', ...activeMenus]));
  });

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    );
  };

  const handleMenuClick = () => {
    if (isMobile) toggleSidebar();
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (
      item.path &&
      (location.pathname === item.path ||
        location.pathname.startsWith(item.path + '/'))
    ) {
      return true;
    }

    if (item.children) {
      return item.children.some(child =>
        location.pathname === child.path ||
        location.pathname.startsWith(child.path + '/')
      );
    }

    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    // Permission check parent
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    // Permission check children
    if (item.children && !item.permission) {
      const hasVisibleChildren = item.children.some(child =>
        !child.permission || hasPermission(child.permission)
      );
      if (!hasVisibleChildren) return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.name);
    const isActive = isMenuActive(item);

    // Menu with children
    if (hasChildren) {
      return (
        <li key={item.name}>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px]
              transition-colors duration-150 cursor-pointer
              ${isActive
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}
            `}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {item.icon}
            </span>

            {sidebarOpen && (
              <>
                <span className="flex-1 text-left font-medium">
                  {item.name}
                </span>
                <FiChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>

          {sidebarOpen && isExpanded && (
            <ul className="mt-1 space-y-0.5">
              {item.children?.map(child => {
                if (child.permission && !hasPermission(child.permission)) {
                  return null;
                }

                const isChildActive =
                  location.pathname === child.path ||
                  location.pathname.startsWith(child.path + '/');

                return (
                  <li key={child.path}>
                    <NavLink
                      to={child.path}
                      onClick={handleMenuClick}
                      className={`
                        flex items-center gap-3 pl-11 pr-3 py-2 rounded-md text-[13px]
                        transition-colors duration-150 cursor-pointer
                        ${isChildActive
                          ? 'text-[#0ea5e9] bg-sky-50 font-medium'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}
                      `}
                    >
                      {child.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    // Menu tanpa children
    return (
      <li key={item.path}>
        <NavLink
          to={item.path!}
          onClick={handleMenuClick}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-md text-[13px]
            transition-colors duration-150 cursor-pointer
            ${isActive
              ? 'text-[#0ea5e9] bg-sky-50 font-medium'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}
          `}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            {item.icon}
          </span>
          {sidebarOpen && <span>{item.name}</span>}
        </NavLink>
      </li>
    );
  };

  return (
    <nav className="flex-1 flex flex-col overflow-y-auto py-3 px-3">
      <ul className="space-y-0.5 flex-1">
        {mainMenuItems.map(item => renderMenuItem(item))}
      </ul>
    </nav>
  );
};

export default SidebarMenu;
