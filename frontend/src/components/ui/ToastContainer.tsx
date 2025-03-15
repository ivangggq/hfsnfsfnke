import React from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useToast } from '@/context/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  // Función para renderizar mensajes con múltiples líneas
  const renderMessage = (message: string) => {
    // Verifica si el mensaje contiene saltos de línea
    if (message.includes('\n')) {
      // Divide el mensaje en líneas
      const lines = message.split('\n');
      return (
        <div className="space-y-1">
          {lines.map((line, index) => (
            <p key={index} className="text-sm font-medium text-gray-900">
              {line}
            </p>
          ))}
        </div>
      );
    }
    
    // Si es un mensaje de una sola línea, lo muestra normalmente
    return (
      <p className="text-sm font-medium text-gray-900">
        {message}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Transition
            key={toast.id}
            show={true}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-w-md w-full min-w-[320px] bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {toast.type === 'success' && (
                      <CheckCircleIcon className="h-6 w-6 text-success" aria-hidden="true" />
                    )}
                    {toast.type === 'error' && (
                      <ExclamationCircleIcon className="h-6 w-6 text-error" aria-hidden="true" />
                    )}
                    {toast.type === 'warning' && (
                      <ExclamationCircleIcon className="h-6 w-6 text-warning" aria-hidden="true" />
                    )}
                    {toast.type === 'info' && (
                      <InformationCircleIcon className="h-6 w-6 text-secondary" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3 flex-1 pt-0.5">
                    {renderMessage(toast.message)}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={() => removeToast(toast.id)}
                    >
                      <span className="sr-only">Cerrar</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;