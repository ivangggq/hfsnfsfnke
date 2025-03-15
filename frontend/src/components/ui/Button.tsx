import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size-specific classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded',
    sm: 'px-3 py-2 text-sm leading-4 rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-4 py-2 text-base rounded-md',
    xl: 'px-6 py-3 text-base rounded-md',
  };
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 border border-transparent',
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 border border-transparent',
    light: 'bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-200 border border-neutral-300',
    dark: 'bg-neutral-800 text-white hover:bg-neutral-900 focus:ring-neutral-500 border border-transparent',
    link: 'text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500 border-none bg-transparent',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };
  
  // Loading and disabled classes
  const stateClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${stateClasses}
        ${widthClasses}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {!isLoading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
    </button>
  );
};

export default Button;