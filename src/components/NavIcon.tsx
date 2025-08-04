'use client';

import { useState } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

interface NavIconProps {
  iconName: 'job' | 'map' | 'bot';
  alt: string;
}

export default function NavIcon({ iconName, alt }: NavIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedIcon, setSelectedIcon } = useNavigation();
  
  const isSelected = selectedIcon === iconName;

  const getIconSrc = () => {
    if (isSelected && isHovered) {
      return `/assets/${iconName}-selected-hover.svg`;
    } else if (isSelected) {
      return `/assets/${iconName}-selected.svg`;
    } else if (isHovered) {
      return `/assets/${iconName}-hover.svg`;
    } else {
      return `/assets/${iconName}.svg`;
    }
  };

  const handleClick = () => {
    setSelectedIcon(iconName);
  };

  return (
    <div 
      style={{ 
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 96,
        height: 96,
        borderRadius: "0",
        background: isHovered ? "#333333" : "transparent",
        // transform: isHovered ? "scale(1.15)" : "scale(1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img 
        src={getIconSrc()} 
        alt={alt} 
        width={50} 
        height={50}
        style={{
          transition: "all 0.2s ease-in-out",
          transform: isHovered ? "scale(1.2)" : "scale(1)"
        }}
      />
    </div>
  );
} 