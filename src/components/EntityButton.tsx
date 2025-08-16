/**
 * @fileoverview EntityButton component for displaying a button with an entity label and ID.
 * The button can be clicked to navigate to a job's respective Pipe or Robot.
 * It supports hover effects and can be customized with an onClick handler.
 * Uses client-side rendering.
 * @remark The Pipe and Robot pages are not currently implemented.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Props for EntityButton component.
 * @property label - The label for the entity (either 'Pipe' or 'Robot').
 * @property entityId - The ID of the entity.
 * @property onClick - Optional callback function to execute when the button is clicked.
 */
interface EntityButtonProps {
  label: 'Pipe' | 'Robot';
  entityId: string;
  onClick?: () => void;
}

/**
 * EntityButton component for displaying an entity label and ID.
 * @param param0 - The props for the EntityButton component.
 * @returns The EntityButton component.
 * @remark The Pipe and Robot pages are not currently implemented.
 */
export default function EntityButton({ label, entityId, onClick }: EntityButtonProps) {
  // State to manage hover effect
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter(); // Use Next.js router for navigation to eventual Pipe or Robot pages

  /**
  * Handle click event to navigate to the respective page or execute onClick callback
  * If onClick is provided, it will be called when the button is clicked.
  * Otherwise, it navigates to the Pipe or Robot page based on the label.
   */
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation behavior
      if (label === 'Pipe') {
        router.push('/map'); // Navigate to map page with pipe highlighted (map page is not implemented yet)
      } else if (label === 'Robot') {
        router.push('/bot'); // Navigate to bot page with robot highlighted (bot page is not implemented yet)
      }
    }
  };

  /**
   * Get the icon based on the label
   * @returns The source of the icon based on the label.
   */
  const getIconSrc = () => {
    return label === 'Pipe' ? '/assets/pipe.svg' : '/assets/bot.svg';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${(8/776*100).toFixed(3)}vh ${(16/1536*100).toFixed(3)}vw`,
        background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderRadius: '0vw',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: 'none',
        minHeight: `${(32/776*100).toFixed(3)}vh`,
        boxSizing: 'border-box',
        marginLeft: `${(8/1536*100).toFixed(3)}vw`,
        marginRight: `${(8/1536*100).toFixed(3)}vw`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Left side - Label and ID */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${(4/1536*100).toFixed(3)}vw`,
        fontFamily: 'Roboto Mono, monospace',
        fontSize: `${(14/1536*100).toFixed(3)}vw`,
        color: '#FFFFFF'
      }}>
        <span style={{ fontWeight: 'bold' }}>{label}:</span>
        <span style={{ fontWeight: '400' }}>{entityId}</span>
      </div>

      {/* Right side - Icons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${(1/1536*100).toFixed(3)}vw`
      }}>
        {/* There are actually 2 icons: a right arrow, followed by a pipe or robot icon */}
        <img
          src="/assets/arrow.svg"
          alt="Arrow"
          style={{
            width: `${(16/1536*100).toFixed(3)}vw`,
            height: `${(16/776*100).toFixed(3)}vh`,
            filter: 'invert(100%)' // Make arrow white
          }}
        />
        <img
          src={getIconSrc()}
          alt={label}
          style={{
            width: `${(16/1536*100).toFixed(3)}vw`,
            height: `${(16/776*100).toFixed(3)}vh`,
            filter: 'invert(100%)' // Make icon white
          }}
        />
      </div>
    </div>
  );
} 