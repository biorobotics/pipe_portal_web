'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ClockSelectorProps {
  selectedHour: number;
  onHourChange: (hour: number) => void;
  size?: number;
}

export default function ClockSelector({ 
  selectedHour, 
  onHourChange, 
  size = 150 
}: ClockSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const center = size / 2;
  const ringRadius = (size / 2) - 8; // Position dots on the ring itself
  const dotRadius = 6;
  const selectedDotRadius = 10;

  // Calculate position for each hour dot
  const getDotPosition = (hour: number) => {
    // Convert hour to angle (12 o'clock is 0 degrees, 3 o'clock is 90 degrees)
    const angle = ((hour - 12) * 30) * (Math.PI / 180);
    const x = center + (ringRadius + 2) * Math.sin(angle);
    const y = center - (ringRadius + 2) * Math.cos(angle);
    return { x, y };
  };

  // Calculate which hour a position corresponds to
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

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const hour = getHourFromPosition(event.clientX, event.clientY);
        onHourChange(hour);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

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

      {/* Center number */}
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