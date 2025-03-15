import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { user } = useAuthContext();

  // Navigation items with icons
  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Empresas',
      to: '/companies',
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: 'Documentos',
      to: '/documents',
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: 'Plantillas',
      to: '/templates',
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
  ];

  // Admin-only navigation items
  const adminNavigation: NavItem[] = [
    {
      name: 'Administración',
      to: '/admin',
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Combine regular and admin navigation if user has admin role
  const menuItems = user?.roles?.includes('admin')
    ? [...navigation, ...adminNavigation]
    : navigation;

  // Mobile sidebar with overlay
  const mobileSidebar = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-white transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img className="h-8 w-auto" src="/assets/logo.svg" alt="EasyCert" />
            <span className="ml-2 text-lg font-bold text-primary-700">
              EasyCert
            </span>
          </Link>
          <button
            onClick={closeSidebar}
            className="rounded-md text-neutral-500 hover:text-primary-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`group flex items-center px-2 py-2 rounded-md ${
                isActive(item.to)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={closeSidebar}
            >
              <div
                className={`mr-3 ${
                  isActive(item.to)
                    ? 'text-primary-700'
                    : 'text-neutral-500 group-hover:text-primary-700'
                }`}
              >
                {item.icon}
              </div>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-neutral-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div
                    className={`mr-3 ${
                      isActive(item.to)
                        ? 'text-primary-700'
                        : 'text-neutral-500 group-hover:text-primary-700'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
};

export default Sidebar;