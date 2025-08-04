'use client';

import { useState } from 'react';

interface AddButtonProps {
  text: string;
  onClick?: () => void;
  fontFamily?: string;
  fontWeight?: string;
}

export default function AddButton({ 
  text, 
  onClick, 
  fontFamily = 'Roboto Mono, monospace',
  fontWeight = '400'
}: AddButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '8px 16px',
        background: isHovered ? '#ff4d33' : '#ff2400',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isHovered ? '0 4px 8px rgba(255, 36, 0, 0.3)' : '0 2px 4px rgba(255, 36, 0, 0.2)',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        boxSizing: 'border-box',
        fontFamily,
        fontWeight,
        fontSize: '14px',
        whiteSpace: 'nowrap'
      }}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <g>
          <path d="M11.25 17h1.5v-4.25H17v-1.5h-4.25V7h-1.5v4.25H7v1.5h4.25V17ZM4.5 21c-0.4 0 -0.75 -0.15 -1.05 -0.45 -0.3 -0.3 -0.45 -0.65 -0.45 -1.05V4.5c0 -0.4 0.15 -0.75 0.45 -1.05C3.75 3.15 4.1 3 4.5 3h15c0.4 0 0.75 0.15 1.05 0.45 0.3 0.3 0.45 0.65 0.45 1.05v15c0 0.4 -0.15 0.75 -0.45 1.05 -0.3 0.3 -0.65 0.45 -1.05 0.45H4.5Zm0 -1.5h15V4.5H4.5v15Z" fill="currentColor" strokeWidth="0.5"></path>
        </g>
      </svg>
      <span>{text}</span>
    </button>
  );
} 