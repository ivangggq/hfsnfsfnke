import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and hamburger menu */}
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-primary-600 focus:outline-none lg:hidden"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-auto"
                src="/assets/logo.svg"
                alt="EasyCert"
              />
              <span className="ml-2 text-xl font-bold text-primary-700">
                EasyCert
              </span>
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4 relative flex items-center">
                {/* Notifications */}
                <button className="p-2 rounded-full text-neutral-500 hover:text-primary-600 focus:outline-none">
                  <span className="sr-only">View notifications</span>
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                {/* User dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </div>
                    </button>
                  </div>
                  {userMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="py-1" role="none">
                        <Link
                          to="/settings/profile"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Mi Perfil
                        </Link>
                        <Link
                          to="/settings/account"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Configuración
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          role="menuitem"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="text-neutral-500 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;