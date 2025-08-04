'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EntityButtonProps {
  label: 'Pipe' | 'Robot';
  entityId: string;
  onClick?: () => void;
}

export default function EntityButton({ label, entityId, onClick }: EntityButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation behavior
      if (label === 'Pipe') {
        router.push('/map'); // Navigate to map page with pipe highlighted
      } else if (label === 'Robot') {
        router.push('/bot'); // Navigate to bot page with robot highlighted
      }
    }
  };

  const getIconSrc = () => {
    return label === 'Pipe' ? '/assets/pipe.svg' : '/assets/bot.svg';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderRadius: '0px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: 'none',
        minHeight: '32px',
        boxSizing: 'border-box' as const,
        marginLeft: '8px',
        marginRight: '8px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Left side - Label and ID */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'Roboto Mono, monospace',
        fontSize: '14px',
        color: '#FFFFFF'
      }}>
        <span style={{ fontWeight: 'bold' }}>{label}:</span>
        <span style={{ fontWeight: '400' }}>{entityId}</span>
      </div>

      {/* Right side - Icons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <img
          src="/assets/arrow.svg"
          alt="Arrow"
          style={{
            width: '16px',
            height: '16px',
            filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' // Make arrow white
          }}
        />
        <img
          src={getIconSrc()}
          alt={label}
          style={{
            width: '16px',
            height: '16px',
            filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' // Make icon white
          }}
        />
      </div>
    </div>
  );
} 