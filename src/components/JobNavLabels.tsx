'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobNavLabelsProps {
  labels: string[];
  selectedLabel: string;
  onLabelClick: (label: string) => void;
}

export default function JobNavLabels({ labels, selectedLabel, onLabelClick }: JobNavLabelsProps) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const router = useRouter();

  const handleLabelClick = (label: string) => {
    onLabelClick(label);
    
    // Navigate based on label
    if (label === 'Data') {
      router.push('/');
    } else if (label === 'Observations') {
      router.push('/observations');
    }
  };

  const getLabelStyle = (label: string) => {
    const isSelected = selectedLabel === label;
    const isHovered = hoveredLabel === label;
    
    let background = 'transparent';
    let border = '2px solid transparent';
    
    if (isSelected && isHovered) {
      background = 'rgba(36, 36, 36, 0.1)'; // Dark transparent background
      border = '2px solid #242424';
    } else if (isSelected) {
      background = 'rgba(36, 36, 36, 0.1)'; // Dark transparent background
      border = '2px solid #242424'; // Dark outline
    } else if (isHovered) {
      background = 'rgba(36, 36, 36, 0.1)'; // Dark transparent background
      border = '2px solid transparent';
    }

    return {
      padding: '4px 24px',
      background,
      border,
      cursor: 'pointer',
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      color: isSelected ? '#242424' : '#242424',
      transition: 'all 0.2s ease-in-out',
      whiteSpace: 'nowrap' as const,
      display: 'inline-block',
      marginRight: '0px'
    };
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
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