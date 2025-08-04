'use client';

import { useState } from 'react';

interface DataSectionProps {
  latitude: number;
  longitude: number;
  altitude: number;
  pipeDiameter: number;
}

export default function DataSection({ 
  latitude, 
  longitude, 
  altitude, 
  pipeDiameter 
}: DataSectionProps) {
  const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms'>('decimal');

  const formatLatitude = (lat: number, format: 'decimal' | 'dms') => {
    if (format === 'decimal') {
      return lat.toFixed(6);
    } else {
      const abs = Math.abs(lat);
      const degrees = Math.floor(abs);
      const minutes = Math.floor((abs - degrees) * 60);
      const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(2);
      const direction = lat >= 0 ? 'N' : 'S';
      return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
    }
  };

  const formatLongitude = (lng: number, format: 'decimal' | 'dms') => {
    if (format === 'decimal') {
      return lng.toFixed(6);
    } else {
      const abs = Math.abs(lng);
      const degrees = Math.floor(abs);
      const minutes = Math.floor((abs - degrees) * 60);
      const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(2);
      const direction = lng >= 0 ? 'E' : 'W';
      return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
    }
  };

  const toggleFormat = () => {
    setCoordinateFormat(coord => coord === 'decimal' ? 'dms' : 'decimal');
  };

  return (
    <div style={{
      background: 'transparent',
      border: '2px solid #C0C0C0',
      padding: '16px',
      width: '280px', // Increased width to prevent DMS wrapping
      height: 'calc(35vh - 40px)', // Reduced height to give more space to observations
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
          Data
        </h3>
        
        {/* Format Toggle Button */}
        <button
          onClick={toggleFormat}
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
            width: '80px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#8C8C8C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#484848';
          }}
        >
          {coordinateFormat === 'decimal' ? 'DMS' : 'Decimal'}
        </button>
      </div>

      {/* Data Items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1
      }}>
        {/* Latitude */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Latitude:
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#242424',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            {formatLatitude(latitude, coordinateFormat)}
          </span>
        </div>

        {/* Longitude */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Longitude:
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#242424',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            {formatLongitude(longitude, coordinateFormat)}
          </span>
        </div>

        {/* Altitude */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Altitude:
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#242424',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            {altitude.toFixed(2)} m
          </span>
        </div>

        {/* Pipe Diameter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Pipe Diameter:
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#242424',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            {pipeDiameter.toFixed(1)} cm
          </span>
        </div>
      </div>
    </div>
  );
} 