/**
 * @fileoverview ClockSelector component for selecting an hour on a clock face to indicate an observation's location
 * along the pipe's cross-section.
 * The clock face is interactive, allowing users to drag to select an hour or click to select a specific hour. The
 * selected hour is highlighted. The component selects the 12 position as the default.
 * Uses client-side rendering.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

/**
 * Props for ClockSelector component.
 * @property selectedHour - The currently selected hour (1-12).
 * @property onHourChange - Callback function to execute when the hour is changed.
 * @property size - Optional size of the clock face in pixels.
 */
interface ClockSelectorProps {
  selectedHour: number;
  onHourChange: (hour: number) => void;
  size?: number;
}

/**
 * ClockSelector component for selecting an hour on a clock face.
 * @param param0 - The props for the ClockSelector component.
 * @returns ClockSelector component.
 */
export default function ClockSelector({ 
  selectedHour, 
  onHourChange, 
  size = 150 
}: ClockSelectorProps) {
  // State to manage dragging and hover effects
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the clock container

  const center = size / 2; // Center of the clock
  const ringRadius = (size / 2) - 8; // Position dots along the edge of the clock
  const dotRadius = 6;  // Radius for unselected dots
  const selectedDotRadius = 10; // Radius for selected dot

  /**
   * Calculate the x and y coordinates for the dot position based on the hour.
   * @param hour - The hour to calculate the dot position for.
   * @returns The x and y coordinates for the dot position based on the hour.
   */
  const getDotPosition = (hour: number) => {
    // Convert hour to angle (12 o'clock is 0 degrees, 3 o'clock is 90 degrees)
    const angle = ((hour - 12) * 30) * (Math.PI / 180);
    const x = center + (ringRadius + 2) * Math.sin(angle);
    const y = center - (ringRadius + 2) * Math.cos(angle);
    return { x, y };
  };

  /**
   * Get the hour from the coordinates
   * @param clientX - The x coordinate of the mouse event.
   * @param clientY - The y coordinate of the mouse event.
   * @returns The hour corresponding to the coordinates on the clock face.
   */
  const getHourFromPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return selectedHour;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + center;
    const centerY = rect.top + center;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Calculate angle
    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    // Convert angle to hour (12 o'clock = 0 degrees)
    const hour = Math.round(angle / 30);
    return hour === 0 ? 12 : hour;
  };

  // Handle various mouse events
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    const hour = getHourFromPosition(event.clientX, event.clientY);
    onHourChange(hour);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      const hour = getHourFromPosition(event.clientX, event.clientY);
      onHourChange(hour);
    } else {
      // Handle hover
      const hour = getHourFromPosition(event.clientX, event.clientY);
      setHoveredHour(hour);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredHour(null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: size,
        height: size,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Clock circle background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        border: '0.781vw solid #ff2400',
        background: '#000000'
      }} />

      {/* Hour dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const hour = i + 1;
        const position = getDotPosition(hour);
        const isSelected = hour === selectedHour;
        const isHovered = hour === hoveredHour && !isDragging;
        const currentRadius = isSelected ? selectedDotRadius : dotRadius;

        return (
          <div
            key={hour}
            style={{
              position: 'absolute',
              left: position.x - currentRadius,
              top: position.y - currentRadius,
              width: currentRadius * 2,
              height: currentRadius * 2,
              borderRadius: '50%',
              background: isSelected ? '#ff2400' : '#ffffff', // Red when selected, white when not
              border: isSelected ? '0.130vw solid #ffffff' : // White outline when selected
                      isHovered ? '0.065vw solid rgba(255, 255, 255, 0.5)' : 'none',
              boxShadow: isSelected ? `0 0 ${(4/1536*100).toFixed(3)}vw rgba(255, 255, 255, 0.8)` : 'none',
              transition: 'all 0.2s ease',
              pointerEvents: 'none' // Let the container handle all mouse events
            }}
          />
        );
      })}

      {/* Center number indicating the selected hour position */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        fontSize: `${(28/1536*100).toFixed(3)}vw`,
        fontWeight: 'bold',
        fontFamily: 'Roboto Mono, monospace',
        pointerEvents: 'none'
      }}>
        {selectedHour}
      </div>
    </div>
  );
} 