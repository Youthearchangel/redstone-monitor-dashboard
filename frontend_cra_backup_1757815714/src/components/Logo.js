import React from 'react';

const Logo = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon */}
      <polygon
        points="50,5 85,25 85,75 50,95 15,75 15,25"
        fill="none"
        stroke="#dc2626"
        strokeWidth="8"
      />
      
      {/* Inner hexagon */}
      <polygon
        points="50,20 70,30 70,70 50,80 30,70 30,30"
        fill="none"
        stroke="#dc2626"
        strokeWidth="8"
      />
      
      {/* Connecting lines */}
      <line x1="15" y1="25" x2="30" y2="30" stroke="#dc2626" strokeWidth="6"/>
      <line x1="85" y1="25" x2="70" y2="30" stroke="#dc2626" strokeWidth="6"/>
      <line x1="85" y1="75" x2="70" y2="70" stroke="#dc2626" strokeWidth="6"/>
      <line x1="15" y1="75" x2="30" y2="70" stroke="#dc2626" strokeWidth="6"/>
      <line x1="50" y1="5" x2="50" y2="20" stroke="#dc2626" strokeWidth="6"/>
      <line x1="50" y1="95" x2="50" y2="80" stroke="#dc2626" strokeWidth="6"/>
    </svg>
  );
};

export default Logo;
