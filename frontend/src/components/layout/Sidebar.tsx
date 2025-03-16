import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BookOpen, FileText, ShieldCheck, Settings } from 'lucide-react';
import {
  HomeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  UsersIcon,
  ChevronDownIcon,
  InformationCircleIcon,
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
  subItems?: Array<{
    name: string;
    to: string;
    icon: React.ElementType;
  }>;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile, onClose }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  // Extraer el ID de compañía de la URL si estamos en una ruta de compañía
  const companyId = useMemo(() => {
    const match = location.pathname.match(/\/companies\/([^\/]+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  // Comprobar si estamos en alguna página relacionada con una compañía específica
  const isCompanyRoute = Boolean(companyId);
  
  // Comprobar si estamos en alguna página relacionada con el perfil o configuración
  const isProfileRoute = location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings');

  // Definir los elementos del menú, incluyendo submenús condicionales
  const navItems: NavItem[] = useMemo(() => [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { 
      name: 'Empresas', 
      to: '/companies', 
      icon: BuildingOfficeIcon,
      ...(isCompanyRoute && {
        subItems: [
          { 
            name: 'Información General', 
            to: `/companies/${companyId}`, 
            icon: InformationCircleIcon 
          },
          { 
            name: 'Seguridad', 
            to: `/companies/${companyId}/security-info`, 
            icon: ShieldCheck 
          },
          { 
            name: 'Documentos', 
            to: `/companies/${companyId}/documents`, 
            icon: FileText 
          }
        ]
      })
    },
    { name: 'Plantillas', to: '/templates', icon: ClipboardDocumentCheckIcon },
    { 
      name: 'Perfil', 
      to: '/profile', 
      icon: UserCircleIcon,
      ...(isProfileRoute && {
        subItems: [
          { 
            name: 'Información Personal', 
            to: '/profile', 
            icon: UserCircleIcon 
          },
          { 
            name: 'Configuración', 
            to: '/settings', 
            icon: Settings 
          },
          { 
            name: 'Subscripción', 
            to: '/profile/subscription', 
            icon: ShieldCheck 
          }
        ]
      })
    },
    { name: 'Administrar Usuarios', to: '/admin/users', icon: UsersIcon, adminOnly: true },
  ], [companyId, isCompanyRoute, isProfileRoute]);

  // Verificar si una ruta actual corresponde al item o a alguno de sus subitems
  const isActiveRoute = (item: NavItem): boolean => {
    // Para la ruta exacta
    if (location.pathname === item.to) return true;
    
    // Para los subitems
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.to);
    }
    
    // Caso especial para /settings - considerarlo activo cuando estamos en Perfil
    if (item.name === 'Perfil' && location.pathname === '/settings') return true;
    
    return false;
  };

  // Verificar si un item debería mostrar sus subitems expandidos
  const shouldExpandSubItems = (item: NavItem): boolean => {
    if (!item.subItems) return false;
    
    // Expandir si estamos en la ruta principal del item
    if (location.pathname === item.to) return true;
    
    // Expandir si estamos en alguna de las rutas de los subitems
    if (item.subItems.some(subItem => location.pathname.startsWith(subItem.to))) return true;
    
    return false;
  };

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

            const active = isActiveRoute(item);
            const expanded = shouldExpandSubItems(item);
            
            return (
              <div key={item.name}>
                <NavLink
                  to={item.to}
                  end={Boolean(item.subItems)}
                  className={({ isActive }) =>
                    `${
                      isActive || active
                        ? 'bg-primary-700 text-white'
                        : 'text-white hover:bg-primary-600 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`${
                          isActive || active ? 'text-white' : 'text-primary-300 group-hover:text-white'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.subItems && (
                        <ChevronDownIcon
                          className={`${
                            expanded ? 'transform rotate-180' : ''
                          } ml-2 h-4 w-4 text-primary-300 group-hover:text-white transition-transform duration-150`}
                        />
                      )}
                    </>
                  )}
                </NavLink>
                
                {/* Subitems */}
                {item.subItems && expanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map(subItem => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.to}
                        end
                        className={({ isActive }) => {
                          // Considerar activo '/settings' cuando estamos en esa ruta
                          const isNavActive = isActive || 
                            (subItem.to === '/settings' && location.pathname === '/settings');
                          
                          return `${
                            isNavActive
                              ? 'bg-primary-800 text-white'
                              : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                          } group flex items-center px-2 py-2 text-xs font-medium rounded-md`;
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <subItem.icon
                              className={`${
                                isActive ? 'text-white' : 'text-primary-300 group-hover:text-white'
                              } mr-2 flex-shrink-0 h-4 w-4`}
                              aria-hidden="true"
                            />
                            {subItem.name}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      <a 
        href="http://localhost:8000/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full"
      >
        <div className="flex-shrink-0 flex bg-primary-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-white" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Documentación</p>
                <p className="text-xs font-medium text-primary-200">Manual de usuario</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Sidebar;