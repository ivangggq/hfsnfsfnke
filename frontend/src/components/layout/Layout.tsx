import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuthContext } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Simple layout for unauthenticated users (login, register pages)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Full layout with sidebar for authenticated users
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex-grow flex">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;