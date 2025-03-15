import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  onClose,
}) => {
  // Variant based colors
  const variantClasses = {
    info: {
      background: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-700',
      icon: 'text-blue-400',
    },
    success: {
      background: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: 'text-green-400',
    },
    warning: {
      background: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: 'text-yellow-400',
    },
    error: {
      background: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: 'text-red-400',
    },
  };
  
  const classes = variantClasses[variant];
  
  // Alert icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'info':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`${classes.background} ${classes.border} border-l-4 p-4 rounded-md mb-4`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${classes.icon}`}>
          {getIcon()}
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${classes.text}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${classes.text} mt-1`}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${classes.background} ${classes.text} hover:${classes.background} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${classes.background} focus:ring-${classes.background}`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;