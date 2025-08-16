/**
 * @fileoverview JobNavLabels component for rendering navigation labels/tabs in the JobNavigationBar component.
 * Handles selection, hover, and navigation logic for each label.
 * Uses client-side rendering.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Props for the JobNavLabels component.
 * @property labels - Array of label strings to display as navigation tabs.
 * @property selectedLabel - The currently selected label.
 * @property onLabelClick - Callback when a label is clicked.
 */
interface JobNavLabelsProps {
  labels: string[];
  selectedLabel: string;
  onLabelClick: (label: string) => void;
}


/**
 * JobNavLabels component for rendering navigation labels/tabs for job navigation.
 * Handles selection, hover, and navigation logic for each label.
 *
 * @param param0 - The props for the JobNavLabels component.
 * @returns The JobNavLabels component.
 * @remark This component is used within the JobNavigationBar to display job navigation tabs.
 * It allows users to click on labels to navigate to different sections of the job interface.
 */
export default function JobNavLabels({ labels, selectedLabel, onLabelClick }: JobNavLabelsProps) {
  /**
   * The label currently being hovered, or null if none.
   */
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  /**
   * Next.js router for navigation.
   */
  const router = useRouter();

  /**
   * Handles label click: triggers callback and navigates if needed.
   * @param label - The label that was clicked.
   */
  const handleLabelClick = (label: string) => {
    onLabelClick(label);
    // Navigate based on label
    if (label === 'Data') {
      router.push('/');
    } else if (label === 'Observations') {
      router.push('/observations');
    }
  };

  /**
   * Get the style object for a label based on its state.
   * @param label - The label to style.
   * @return The style object for the label.
   */
  const getLabelStyle = (label: string) => {
    const isSelected = selectedLabel === label;
    const isHovered = hoveredLabel === label;
    let background = 'transparent';
    let border = '0.26vh solid transparent';
    if (isSelected && isHovered) {
      background = 'rgba(36, 36, 36, 0.1)'; // Dark transparent background
      border = '0.26vh solid #242424';
    } else if (isSelected) {
      background = 'rgba(36, 36, 36, 0.1)'; // Dark transparent background
      border = '0.26vh solid #242424'; // Dark outline
    } else if (isHovered) {
      background = 'rgba(36, 36, 36, 0.1)'; // Dark transparent background
      border = '0.26vh solid transparent';
    }
    return {
      padding: '0.52vh 1.56vw',
      background,
      border,
      cursor: 'pointer',
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '0.91vw',
      fontWeight: '500',
      color: isSelected ? '#242424' : '#242424',
      transition: 'all 0.2s ease-in-out',
      whiteSpace: 'nowrap' as const,
      display: 'inline-block',
      marginRight: '0'
    };
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.52vh',
      padding: '0'
    }}>
      {labels.map((label) => (
        <div
          key={label}
          style={getLabelStyle(label)}
          onMouseEnter={() => setHoveredLabel(label)}
          onMouseLeave={() => setHoveredLabel(null)}
          onClick={() => handleLabelClick(label)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}