'use client';

import { useState } from 'react';

interface WorkOrderItemProps {
  name: string;
  children?: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export default function WorkOrderItem({ 
  name, 
  children, 
  isExpanded = false,
  onToggle
}: WorkOrderItemProps) {
  const [internalExpanded, setInternalExpanded] = useState(isExpanded);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use external expanded state if provided, otherwise use internal state
  const expanded = onToggle !== undefined ? isExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !expanded;
    if (onToggle) {
      onToggle(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <div>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          marginLeft: '8px',
          marginRight: '8px',
          cursor: 'default',
          background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: '0',
          transition: 'all 0.2s ease-in-out',
          userSelect: 'none'
        }}
      >
        {/* Expand/Collapse Arrow */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          style={{
            width: '16px',
            height: '16px',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
            color: '#FFFFFF'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Folder Icon */}
        <div style={{ marginRight: '8px', color: '#FFFFFF' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13 14a2 2 0 0 0 2 -2v-3a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2V12a2 2 0 0 0 2 2h10Zm-12 -7.235999999999999V4a2 2 0 0 1 2 -2h3.5859999999999994a1.5 1.5 0 0 1 1.06 0.43933333333333335l1.4146666666666665 1.414c0.09333333333333334 0.09399999999999999 0.22066666666666668 0.14666666666666667 0.35333333333333333 0.14666666666666667H13a2 2 0 0 1 2 2v0.7639999999999999A2.988666666666666 2.988666666666666 0 0 0 13 6h-10a2.988666666666666 2.988666666666666 0 0 0 -2 0.7639999999999999Z" strokeWidth="0.6667"/>
          </svg>
        </div>

        {/* Work Order Name */}
        <span style={{
          color: '#FFFFFF',
          fontSize: '14px',
          fontFamily: 'Roboto, Arial, sans-serif',
          flex: 1
        }}>
          {name}
        </span>
      </div>

      {/* Children (Jobs) with indent */}
      {expanded && children && (
        <div style={{ marginLeft: '8px' }}>
          {children}
        </div>
      )}
    </div>
  );
} 