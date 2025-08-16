/**
 * @fileoverview BackButton component for navigating back to the jobs list page from the job data page.
 * The button displays an icon and text, and changes appearance on hover. On click, it navigates to /jobs, using
 * Next.js's useRouter for navigation.
 * Uses client-side rendering.
 * @remark The jobs list page is not currently implemented.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * BackButton component for navigating back to the jobs list page.
 * @returns BackButton component for navigating back to the jobs list page.
 */
export default function BackButton() {
  // State to manage hover effect
  const [isHovered, setIsHovered] = useState(false);
  // Use Next.js router for navigation to the jobs list page when the button is clicked
  const router = useRouter();

  // Handle click event to navigate back to the jobs list page
  const handleClick = () => {
    router.push('/jobs');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '17.19vw',
        height: '5.15vh',
        padding: '0',
        background: isHovered ? '#ff4d33' : '#ff2400', // Change background color on hover
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '0.91vw',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.03vh',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isHovered ? '0 0.52vh 1.03vh rgba(255, 36, 0, 0.3)' : '0 0.26vh 0.52vh rgba(255, 36, 0, 0.2)', // Add shadow effect on hover
        transform: isHovered ? 'translateY(-0.13vh)' : 'translateY(0)', // Slightly lift the button on hover
        boxSizing: 'border-box'
      }}
    >
      {/* SVG right chevron icon */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ transform: 'rotate(180deg)', flexShrink: 0 }}
      >
        <path d="M9 18l6-6-6-6"/>
      </svg>
      {/* Button text */}
      <span style={{ whiteSpace: 'nowrap', lineHeight: '1' }}>Back to Jobs</span>
    </button>
  );
} 