'use client';

import { useState } from 'react';

interface JobItemProps {
  name: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function JobItem({ 
  name, 
  isSelected = false, 
  onSelect 
}: JobItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        paddingLeft: '32px',
        marginRight: '8px',
        cursor: 'pointer',
        background: isHovered || isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        border: isSelected ? '1px solid #FFFFFF' : 'none',
        borderRadius: '0',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none'
      }}
    >
      {/* Job Name */}
      <span style={{
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: 'Roboto, Arial, sans-serif',
        flex: 1
      }}>
        {name}
      </span>
    </div>
  );
} 