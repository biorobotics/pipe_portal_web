/**
 * @fileoverview AddButton component for adding new items with a hover effect.
 * The button displays an icon and text, and changes appearance on hover.
 * Uses client-side rendering.
 */

'use client';

import { useState } from 'react';

/**
 * Props for AddButton component.
 * @property text - The text to display on the button.
 * @property onClick - Optional callback function to execute when the button is clicked.
 * @property fontFamily - Optional font family for the button text.
 * @property fontWeight - Optional font weight for the button text.
 */
interface AddButtonProps {
  text: string;
  onClick?: () => void;
  fontFamily?: string;
  fontWeight?: string;
}

/** 
 * AddButton component for adding new items with a hover effect.
 * @param param0 - The props for the AddButton component.
 * @returns AddButton component.
 * 
 */
export default function AddButton({ 
  text, 
  onClick, 
  fontFamily = 'Roboto Mono, monospace',
  fontWeight = '400'
}: AddButtonProps) {
  // State to manage hover effect
  const [isHovered, setIsHovered] = useState(false);

  // Handle click event. If onClick is provided, it will be called when the button is clicked.
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
        padding: '1.031vh 1.042vw',
        background: isHovered ? '#ff4d33' : '#ff2400', // Change background color on hover
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.521vw',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isHovered // Add shadow effect on hover
          ? `0 ${(4/776*100).toFixed(3)}vh ${(8/776*100).toFixed(3)}vh rgba(255, 36, 0, 0.3)`
          : `0 ${(2/776*100).toFixed(3)}vh ${(4/776*100).toFixed(3)}vh rgba(255, 36, 0, 0.2)`,
        transform: isHovered ? `translateY(-${(1/776*100).toFixed(3)}vh)` : 'translateY(0)', // Slightly lift the button on hover
        boxSizing: 'border-box',
        fontFamily,
        fontWeight,
        fontSize: `${(14/1536*100).toFixed(3)}vw`,
        whiteSpace: 'nowrap' // Prevent text wrapping
      }}
    >
      {/* SVG add icon */}
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
      {/* Button text */}
      <span>{text}</span>
    </button>
  );
} 