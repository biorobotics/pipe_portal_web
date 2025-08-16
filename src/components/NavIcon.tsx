/**
 * @fileoverview NavIcon component for rendering a navigation icon on the left bar with hover and selection effects.
 * Integrates with NavigationContext to manage selected icon state.
 * Uses client-side rendering.
 * 
 */
'use client';

import { useState } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

/**
 * Props for the NavIcon component.
 * @property iconName - The name of the icon ('job', 'map', or 'bot').
 * @property alt - The alt text for the icon image.
 */
interface NavIconProps {
  iconName: 'job' | 'map' | 'bot';
  alt: string;
}


/**
 * NavIcon component for rendering a navigation icon with hover and selection effects.
 * Integrates with NavigationContext to manage selected icon state.
 * @param param0 - The props for the NavIcon component.
 * @return NavIcon component.
 */
export default function NavIcon({ iconName, alt }: NavIconProps) {
  /**
   * Whether the icon is currently hovered.
   */
  const [isHovered, setIsHovered] = useState(false);
  /**
   * Selected icon and setter from NavigationContext.
   */
  const { selectedIcon, setSelectedIcon } = useNavigation();
  /**
   * Whether this icon is currently selected.
   */
  const isSelected = selectedIcon === iconName;

  /**
   * Returns the correct icon source based on hover and selection state.
   */
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

  /**
   * Handles click event to set this icon as selected.
   */
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
        background: isHovered ? "#333333" : "transparent"
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