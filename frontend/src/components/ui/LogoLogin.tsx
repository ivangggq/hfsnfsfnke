import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  whiteLogo?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  width = 200, 
  height = 88, 
  className = '', 
  whiteLogo = false 
}) => {
  const primaryColor = whiteLogo ? '#FFFFFF' : '#0C4A41';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document shapes */}
      <rect x="220" y="40" width="60" height="80" rx="5" fill={primaryColor} fillOpacity="0.2"/>
      <rect x="210" y="50" width="60" height="80" rx="5" fill={primaryColor} fillOpacity="0.4"/>
      <rect x="200" y="60" width="60" height="80" rx="5" fill={primaryColor} fillOpacity="0.6"/>
      
      {/* Checkmark */}
      <path 
        d="M200 120 L230 150 L300 80" 
        fill="none" 
        stroke={primaryColor} 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;