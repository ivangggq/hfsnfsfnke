import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  icon,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseClasses = 'block px-4 py-2 border rounded-md focus:outline-none focus:ring-1';
  
  // Status (error) classes
  const statusClasses = error
    ? 'border-red-300 focus:border-red-300 focus:ring-red-300 text-red-900 placeholder-red-300'
    : 'border-gray-300 focus:border-blue-300 focus:ring-blue-300';
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Icon classes
  const iconClasses = icon ? 'pl-10' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`${baseClasses} ${statusClasses} ${widthClass} ${iconClasses} ${className}`}
          {...rest}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;