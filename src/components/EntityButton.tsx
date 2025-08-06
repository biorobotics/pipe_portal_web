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
        padding: `${(8/776*100).toFixed(3)}vh ${(16/1536*100).toFixed(3)}vw`,
        background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderRadius: '0vw',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: 'none',
        minHeight: `${(32/776*100).toFixed(3)}vh`,
        boxSizing: 'border-box' as const,
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
        gap: `${(4/1536*100).toFixed(3)}vw`
      }}>
        <img
          src="/assets/arrow.svg"
          alt="Arrow"
          style={{
            width: `${(16/1536*100).toFixed(3)}vw`,
            height: `${(16/776*100).toFixed(3)}vh`,
            filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' // Make arrow white
          }}
        />
        <img
          src={getIconSrc()}
          alt={label}
          style={{
            width: `${(16/1536*100).toFixed(3)}vw`,
            height: `${(16/776*100).toFixed(3)}vh`,
            filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' // Make icon white
          }}
        />
      </div>
    </div>
  );
} 