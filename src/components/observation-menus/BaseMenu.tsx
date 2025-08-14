'use client';

import React, { useState } from 'react';

interface BaseMenuProps {
  title: string;
  options: Array<{ name: string; code?: string }>;
  onSelect: (name: string, code?: string) => void;
  searchPlaceholder?: string;
}

export default function BaseMenu({ 
  title, 
  options, 
  onSelect, 
  searchPlaceholder = "Search" 
}: BaseMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
  height: 'fit-content'
    }}>
      {/* Search Bar */}
      <div style={{
        padding: `${(16/776*100).toFixed(3)}vh`,
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg 
            width={`${(16/1536*100).toFixed(3)}vw`}
            height={`${(16/776*100).toFixed(3)}vh`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{
              position: 'absolute',
              left: `${(12/1536*100).toFixed(3)}vw`,
              color: '#888'
            }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: `${(8/776*100).toFixed(3)}vh ${(12/1536*100).toFixed(3)}vw ${(8/776*100).toFixed(3)}vh ${(36/1536*100).toFixed(3)}vw`,
              background: '#333',
              border: `${(1/1536*100).toFixed(3)}vw solid #555`,
              borderRadius: `${(4/1536*100).toFixed(3)}vw`,
              color: '#ffffff',
              fontSize: `${(14/1536*100).toFixed(3)}vw`,
              fontFamily: 'Roboto, sans-serif'
            }}
          />
        </div>
      </div>

      {/* Options List */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: `${(8/776*100).toFixed(3)}vh 0`,
        maxHeight: '26vh', // Prevents cutoff and enables scrolling for long lists
      }}>
        {filteredOptions.map((option, index) => (
          <div
            key={option.name}
            style={{
              padding: `${(12/776*100).toFixed(3)}vh ${(16/1536*100).toFixed(3)}vw`,
              cursor: 'pointer',
              fontFamily: 'Roboto Mono, monospace',
              fontSize: `${(14/1536*100).toFixed(3)}vw`,
              color: '#ffffff',
              background: hoveredIndex === index ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onSelect(option.name, option.code)}
          >
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
} 