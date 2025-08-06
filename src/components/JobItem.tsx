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
        padding: '1.03vh 0.78vw',
        paddingLeft: '2.08vw',
        marginRight: '0.52vw',
        cursor: 'pointer',
        background: isHovered || isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        border: isSelected ? '0.13vh solid #FFFFFF' : 'none',
        borderRadius: '0',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none'
      }}
    >
      {/* Job Name */}
      <span style={{
        color: '#FFFFFF',
        fontSize: '0.91vw',
        fontFamily: 'Roboto, Arial, sans-serif',
        flex: 1
      }}>
        {name}
      </span>
    </div>
  );
} 