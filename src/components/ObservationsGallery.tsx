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
      background: '#F0F0F0',
      border: '0.26vh solid #C0C0C0',
      padding: '2.06vh',
      width: '18.23vw',
      height: 'calc(100vh - 8.25vh - 6.19vh - calc(35vh - 5.15vh) - 2.06vh)', // Increased height to fill remaining space
      display: 'flex',
      flexDirection: 'column',
      gap: '1.55vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1.03vh'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.04vw',
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
        gap: '1.55vh',
        paddingRight: '0.52vw'
      }}>
        {observations.map((observation) => (
          <div
            key={observation.id}
            style={{
              padding: '1.03vh',
              border: observation.id === highlightedObservation ? '0.26vh solid #ff2400' : '0.13vh solid #E0E0E0',
              borderRadius: '0',
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
              height: '10.31vh',
              background: `url('/assets/pipe_interior.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '0',
              marginBottom: '1.03vh',
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
              gap: '0.52vh'
            }}>
              <div style={{
                fontSize: '0.91vw',
                fontWeight: '500',
                color: '#242424',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                {observation.title}
              </div>
              <div style={{
                fontSize: '0.78vw',
                color: '#666666',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                {observation.subtitle}
              </div>
              <div style={{
                fontSize: '0.72vw',
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
                top: '1.55vh',
                right: '0.78vw',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.52vh',
                borderRadius: '0.26vh',
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
          border: '0.13vh solid #D0D0D0',
          padding: '1.03vh 0.78vw',
          fontSize: '0.78vw',
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