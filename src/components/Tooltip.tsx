/**
 * @fileoverview Tooltip component for displaying contextual information on hover.
 * Wraps any element and shows a styled tooltip in a configurable position after a delay.
 * Used to provide additional information or hints in the UI.
 * @remark Currently, only the left navigation bar uses this component.
 * Uses client-side rendering.
 */

'use client';

import React, { useState } from 'react';


/**
 * Props for the Tooltip component.
 * @property children - The element(s) that trigger the tooltip on hover.
 * @property content - The text content to display inside the tooltip.
 * @property position - The position of the tooltip relative to the children (default: 'top').
 * @property delay - Delay in milliseconds before showing the tooltip (default: 500).
 */
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}


/**
 * Tooltip component for displaying contextual information on hover.
 * Wraps any element and shows a styled tooltip in a configurable position after a delay.
 * @param children - The element(s) that trigger the tooltip on hover.
 * @param content - The text content to display inside the tooltip.
 * @param position - The position of the tooltip relative to the children (default: 'top').
 * @param delay - Delay in milliseconds before showing the tooltip (default: 500).
 * @returns The wrapped children with tooltip functionality.
 */
export default function Tooltip({ 
  children, 
  content, 
  position = 'top',
  delay = 500 
}: TooltipProps) {
  /**
   * Whether the tooltip is currently visible.
   */
  const [isVisible, setIsVisible] = useState(false);
  /**
   * Timeout ID for delayed tooltip display.
   */
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Handles mouse enter event to show the tooltip after a delay.
   */
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  /**
   * Handles mouse leave event to hide the tooltip and clear any pending timeout.
   */
  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  /**
   * Returns the style object for the tooltip based on its position and visibility.
   * @returns The style object for the tooltip.
   */
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 10,
      backgroundColor: '#333',
      color: 'white',
      padding: '1.03vh 0.78vw',
      borderRadius: '0.52vh',
      fontSize: '0.78vw',
      fontFamily: 'Roboto Mono, monospace',
      whiteSpace: 'nowrap' as const,
      pointerEvents: 'none' as const,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out',
      boxShadow: '0 0.26vh 1.03vh rgba(0,0,0,0.3)',
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '1.03vh',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '1.03vh',
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '0.52vw',
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '0.52vw',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div style={getPositionStyles()}>
        {content}
      </div>
    </div>
  );
}