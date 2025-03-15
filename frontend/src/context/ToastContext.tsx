import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast, { ToastType } from '../components/ui/Toast';

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as ToastType,
    visible: false,
    duration: 5000,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    setToast({
      message,
      type,
      visible: true,
      duration,
    });
  }, []);

  const handleClose = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.visible}
        duration={toast.duration}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};