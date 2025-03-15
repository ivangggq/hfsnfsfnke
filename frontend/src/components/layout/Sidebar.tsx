import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Logo from '@/components/ui/Logo';

interface SidebarProps {
  mobile: boolean;
  onClose?: () => void;
}

// Definición de los elementos del menú
interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Empresas', to: '/companies', icon: BuildingOfficeIcon },
  { name: 'Plantillas', to: '/templates', icon: ClipboardDocumentCheckIcon },
  { name: 'Perfil', to: '/profile', icon: UserCircleIcon },
  { name: 'Administrar Usuarios', to: '/admin/users', icon: UsersIcon, adminOnly: true },
];

const Sidebar: React.FC<SidebarProps> = ({ mobile, onClose }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-primary">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          {mobile && (
            <button
              className="ml-auto flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar menú</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          )}
          <div className={`flex items-center ${mobile ? 'justify-center w-full' : ''}`}>
            <Logo className="h-8 w-auto" whiteLogo />
            <span className="ml-2 text-white text-xl font-semibold">EasyCert</span>
          </div>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            // No mostrar items de admin si el usuario no es admin
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-primary-700 text-white'
                      : 'text-white hover:bg-primary-600 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`${
                        isActive ? 'text-white' : 'text-primary-300 group-hover:text-white'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-primary-700 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Certificación ISO 27001</p>
              <p className="text-xs font-medium text-primary-200">Simplificada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;