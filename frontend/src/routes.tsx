import { createBrowserRouter, Navigate } from 'react-router-dom';
import SettingsPage from '@/pages/settings/SettingsPage'; // Nueva importación

import PrivateRoute from '@/components/PrivateRoute';
import AppLayout from '@/components/layout/AppLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Páginas de autenticación
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Páginas principales
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';

// Páginas de empresas
import CompaniesPage from '@/pages/companies/CompaniesPage';
import CompanyFormPage from '@/pages/companies/CompanyFormPage';
import CompanyDetailPage from '@/pages/companies/CompanyDetailPage';
import CompanySecurityPage from '@/pages/companies/CompanySecurityPage';

// Páginas de documentos
import DocumentsPage from '@/pages/documents/DocumentsPage';
import DocumentFormPage from '@/pages/documents/DocumentFormPage';
import DocumentViewPage from '@/pages/documents/DocumentViewPage';

// Páginas de plantillas
import TemplatesPage from '@/pages/templates/TemplatesPage';

// Páginas de administración
import UsersAdminPage from '@/pages/admin/UsersAdminPage';

// Página 404
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  // Rutas públicas (auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  
  // Rutas privadas (requieren autenticación)
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
          path: 'settings',
          element: <SettingsPage />,  // Nueva ruta
          },
          
          // Rutas de empresas
          {
            path: 'companies',
            element: <CompaniesPage />,
          },
          {
            path: 'companies/new',
            element: <CompanyFormPage />,
          },
          {
            path: 'companies/:id',
            element: <CompanyDetailPage />,
          },
          {
            path: 'companies/:id/edit',
            element: <CompanyFormPage />,
          },
          {
            path: 'companies/:id/security-info',
            element: <CompanySecurityPage />,
          },
          
          // Rutas de documentos
          {
            path: 'companies/:id/documents',
            element: <DocumentsPage />,
          },
          {
            path: 'companies/:id/documents/new',
            element: <DocumentFormPage />,
          },
          {
            path: 'companies/:id/documents/:docId',
            element: <DocumentViewPage />,
          },
          
          // Rutas de plantillas
          {
            path: 'templates',
            element: <TemplatesPage />,
          },
        ],
      },
    ],
  },
  
  // Rutas de administrador
  {
    element: <PrivateRoute requireAdmin={true} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: 'admin/users',
            element: <UsersAdminPage />,
          },
        ],
      },
    ],
  },
  
  // Ruta para manejo de 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);