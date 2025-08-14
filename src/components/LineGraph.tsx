'use client';

import React, { useState, useRef } from 'react';

interface LineGraphProps {
  data: Array<{ time: number; value: number }>;
  currentTime: number;
  totalDuration: number;
  title?: string;
  onTimeChange?: (time: number) => void;
}

export default function LineGraph({ 
  data, 
  currentTime, 
  totalDuration, 
  title = "Title",
  onTimeChange 
}: LineGraphProps) {
  const width = 800;
  const height = 140;
  const padding = 16;
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Use provided data or fallback to empty array
  const graphData = data.length > 0 ? data : [];

  // Find min and max values for scaling
  const values = graphData.map(d => d.value);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 8;
  const valueRange = maxValue - minValue || 1;

  // Convert data points to SVG coordinates
  const points = graphData.map((point, index) => {
    const x = padding + (point.time / totalDuration) * (width - 2 * padding);
    const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Create path for the line
  const pathData = points.split(' ').map((point, index) => {
    const [x, y] = point.split(',').map(Number);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Current time indicator
  const currentTimeX = padding + (currentTime / totalDuration) * (width - 2 * padding);

  // Handle click on graph to seek to time
  const handleGraphClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onTimeChange || isDragging) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left - padding;
    const graphWidth = width - 2 * padding;
    
    // Calculate time based on click position
    const clickedTime = (clickX / graphWidth) * totalDuration;
    const clampedTime = Math.max(0, Math.min(totalDuration, clickedTime));
    
    onTimeChange(clampedTime);
  };

  // Handle drag start
  const handleDragStart = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag
  const handleDrag = (event: React.MouseEvent) => {
    if (!isDragging || !onTimeChange || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const dragX = event.clientX - rect.left - padding;
    const graphWidth = width - 2 * padding;
    
    // Calculate time based on drag position
    const draggedTime = (dragX / graphWidth) * totalDuration;
    const clampedTime = Math.max(0, Math.min(totalDuration, draggedTime));
    
    onTimeChange(clampedTime);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(event);
    }
  };

  // Handle mouse up for drag end
  const handleMouseUp = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  return (
    <div style={{
      background: '#f0f0f0',
      border: '0.13vh solid #ccc',
      borderRadius: '0',
      padding: '2.06vh',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '1.03vh',
        left: '0.52vw',
        fontSize: '0.91vw',
        fontWeight: '500',
        color: '#242424',
        fontFamily: 'Roboto Mono, monospace'
      }}>
        {title}
      </div>

      {/* Y-axis labels */}
      <div style={{
        position: 'absolute',
        left: '0.52vw',
        top: '0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '3.61vh',
        paddingBottom: '2.58vh'
      }}>
        {[8, 7, 6, 5, 4, 3, 2, 1, 0].map(value => (
          <div key={value} style={{
            fontSize: '0.59vw',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            {value}
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div style={{
        position: 'absolute',
        bottom: '1.03vh',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '2.15vw',
        paddingRight: '2.15vw'
      }}>
        <div style={{
          fontSize: '0.59vw',
          color: '#666666',
          fontFamily: 'Roboto Mono, monospace'
        }}>
          {formatTime(0)}
        </div>
        <div style={{
          fontSize: '0.59vw',
          color: '#666666',
          fontFamily: 'Roboto Mono, monospace'
        }}>
          {formatTime(totalDuration)}
        </div>
      </div>

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: '2.58vh',
          left: '2.15vw',
          cursor: onTimeChange ? 'pointer' : 'default'
        }}
        onClick={handleGraphClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(value => {
          const y = height - padding - ((value - minValue) / valueRange) * (height - 2 * padding);
          return (
            <line
              key={value}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#ddd"
              strokeWidth="1"
            />
          );
        })}

        {/* Data line */}
        <path
          d={pathData}
          stroke="#ff2400"
          strokeWidth="2"
          fill="none"
        />

        {/* Current time indicator line (dotted) */}
        <line
          x1={currentTimeX}
          y1={padding}
          x2={currentTimeX}
          y2={height - padding}
          stroke="#242424"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Current time indicator circle (draggable) */}
        {graphData.length > 0 && (() => {
          const currentDataPoint = graphData.find(d => d.time >= currentTime) || graphData[graphData.length - 1];
          const currentValue = currentDataPoint ? currentDataPoint.value : 0;
          const currentY = height - padding - ((currentValue - minValue) / valueRange) * (height - 2 * padding);
          
          return (
            <circle
              cx={currentTimeX}
              cy={currentY}
              r="6"
              fill="#ff2400"
              stroke="white"
              strokeWidth="2"
              style={{
                cursor: onTimeChange ? 'grab' : 'default',
                transition: isDragging ? 'none' : 'all 0.1s ease'
              }}
              onMouseDown={handleDragStart}
              onMouseEnter={() => {
                if (onTimeChange) {
                  document.body.style.cursor = 'grabbing';
                }
              }}
              onMouseLeave={() => {
                document.body.style.cursor = 'default';
              }}
            />
          );
        })()}
      </svg>
    </div>
  );
} 