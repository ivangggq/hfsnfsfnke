import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  footer,
  hoverable = false,
  icon,
}) => {
  const hoverClasses = hoverable ? 'transition-shadow hover:shadow-card-hover' : '';

  return (
    <div className={`bg-white rounded-lg shadow-card overflow-hidden ${hoverClasses} ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-neutral-200 px-6 py-4">
          {title && (
            <div className="flex items-center">
              {icon && <div className="mr-3 text-primary-600">{icon}</div>}
              <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
            </div>
          )}
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="border-t border-neutral-200 px-6 py-4 bg-neutral-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;