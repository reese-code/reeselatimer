import React from 'react';

const TargetIcon = ({ className = "" }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1" />
      <line x1="23" y1="12" x2="1" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

export default TargetIcon;
