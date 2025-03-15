import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import CompanyList from './pages/company/CompanyList';
import CompanyCreate from './pages/company/CompanyCreate';
import CompanyEdit from './pages/company/CompanyEdit';
import CompanyDetails from './pages/company/CompanyDetails';
import DocumentsList from './pages/documents/DocumentsList';
import DocumentDetails from './pages/documents/DocumentDetails';
import DocumentGenerate from './pages/documents/DocumentGenerate';
import Profile from './pages/settings/Profile';
import AccountSettings from './pages/settings/AccountSettings';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Company routes */}
        <Route path="/companies" element={
          <ProtectedRoute>
            <CompanyList />
          </ProtectedRoute>
        } />
        <Route path="/companies/create" element={
          <ProtectedRoute>
            <CompanyCreate />
          </ProtectedRoute>
        } />
        <Route path="/companies/:id" element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        } />
        <Route path="/companies/:id/edit" element={
          <ProtectedRoute>
            <CompanyEdit />
          </ProtectedRoute>
        } />

        {/* Document routes */}
        <Route path="/documents" element={
          <ProtectedRoute>
            <DocumentsList />
          </ProtectedRoute>
        } />
        <Route path="/documents/:id" element={
          <ProtectedRoute>
            <DocumentDetails />
          </ProtectedRoute>
        } />
        <Route path="/documents/generate" element={
          <ProtectedRoute>
            <DocumentGenerate />
          </ProtectedRoute>
        } />

        {/* Settings routes */}
        <Route path="/settings/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings/account" element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        } />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;