'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Observation {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  thumbnailUrl: string;
}

interface ObservationsGalleryProps {
  observations: Observation[];
  highlightedObservation?: string | null;
  onObservationClick?: (observationId: string) => void;
}

export default function ObservationsGallery({ observations, highlightedObservation, onObservationClick }: ObservationsGalleryProps) {
  const router = useRouter();

  const handleObservationClick = (observationId: string) => {
    // Navigate to map page with observation highlighted
    router.push(`/map?observation=${observationId}`);
  };

  const handleViewAllClick = () => {
    // Navigate to observations page
    router.push('/observations');
  };

  return (
    <div style={{
      background: 'transparent',
      border: '2px solid #C0C0C0',
      padding: '16px',
      width: '280px',
      height: 'calc(100vh - 64px - 48px - calc(35vh - 40px) - 16px)', // Increased height to fill remaining space
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: '#242424',
          fontFamily: 'Roboto, Arial, sans-serif'
        }}>
          Observations
        </h3>
      </div>

      {/* Observations List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingRight: '8px'
      }}>
        {observations.map((observation) => (
          <div
            key={observation.id}
            style={{
              padding: '8px',
              border: observation.id === highlightedObservation ? '2px solid #ff2400' : '1px solid #E0E0E0',
              borderRadius: '0px',
              position: 'relative',
              background: observation.id === highlightedObservation ? '#fff5f5' : 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease-in-out'
            }}
            onClick={() => onObservationClick?.(observation.id)}
            onMouseEnter={(e) => {
              if (observation.id !== highlightedObservation) {
                e.currentTarget.style.background = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (observation.id !== highlightedObservation) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {/* Thumbnail */}
            <div style={{
              width: '100%',
              height: '80px',
              background: `url('/assets/pipe_interior.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '0px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Overlay for better text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)'
              }} />
            </div>

            {/* Observation Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#242424',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                {observation.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666666',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                {observation.subtitle}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#999999',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                {observation.timestamp}
              </div>
            </div>

            {/* Map Icon Button */}
            <button
              onClick={() => handleObservationClick(observation.id)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '2px',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.color = '#ff2400';
              }}
              onMouseLeave={(e) => {
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.color = '#666666';
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: '#666666' }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={handleViewAllClick}
        style={{
          background: '#484848',
          border: '1px solid #D0D0D0',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontFamily: 'Roboto Mono, monospace',
          transition: 'all 0.2s ease-in-out',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#8C8C8C';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#484848';
        }}
      >
        <span>View All</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
} 