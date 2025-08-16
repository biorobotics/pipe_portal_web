/**
 * @fileoverview JobItem component for displaying a selectable job item in the work order explorer.
 * Provides hover and selection styling, and triggers a callback on selection.
 * Uses client-side rendering.
 */
'use client';

import { useState } from 'react';


/**
 * Props for the JobItem component.
 * @property name - The name of the job to display.
 * @property isSelected - Whether the job is currently selected.
 * @property onSelect - Callback when the job is selected.
 */
interface JobItemProps {
  name: string;
  isSelected?: boolean;
  onSelect?: () => void;
}


/**
 * JobItem component for displaying a selectable job item in a list.
 * Provides hover and selection styling, and triggers a callback on selection.
 *
 * @param param0 - The props for the JobItem component.
 * @returns JobItem component.
 */
export default function JobItem({ 
  name, 
  isSelected = false, 
  onSelect 
}: JobItemProps) {
  /**
   * Whether the item is currently hovered.
   */
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handles click event and triggers onSelect callback if provided.
   */
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