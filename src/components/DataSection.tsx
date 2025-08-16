/**
 * @fileoverview DataSection component for displaying geographic and pipe data at the current time.
 * Allows toggling between decimal and DMS formats for latitude and longitude.
 */

'use client';

import { useState } from 'react';

/**
 * Properties for DataSection component.
 * @property latitude - The robot's latitude at the current time.
 * @property longitude - The robot's longitude at the current time.
 * @property altitude - The robot's altitudee at the current time.
 * @property pipeDiameter - The pipe's diameter at the current time.
 */
interface DataSectionProps {
  latitude: number;
  longitude: number;
  altitude: number;
  pipeDiameter: number;
}

/**
 * DataSection component for displaying geographic and pipe data at the current time.
 * @param param0 - The properties for the DataSection component.
 * @returns DataSection component.
 */
export default function DataSection({ 
  latitude, 
  longitude, 
  altitude, 
  pipeDiameter 
}: DataSectionProps) {
  // State to manage coordinate format (decimal or DMS), where default is decimal
  const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms'>('decimal');

  /**
   * Takes a latitude number and formats it to either decimal or DMS.
   * @param lat - The latitude to format.
   * @param format - The format to use ('decimal' or 'dms').
   * @returns The formatted latitude string.
   */
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

  /**
   * Takes a longitude number and formats it to either decimal or DMS.
   * @param lng - The longitude to format.
   * @param format - The format to use ('decimal' or 'dms').
   * @returns The formatted longitude string.
   */
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

  /**
   * Toggles the coordinate format between decimal and DMS.
   */
  const toggleFormat = () => {
    setCoordinateFormat(coord => coord === 'decimal' ? 'dms' : 'decimal');
  };

  return (
    <div style={{
      background: 'transparent',
      border: `${(2/1536*100).toFixed(3)}vw solid #C0C0C0`,
      padding: `${(16/776*100).toFixed(3)}vh`,
      width: `${(280/1536*100).toFixed(3)}vw`, // Increased width to prevent DMS wrapping
      height: `calc(35vh - ${(40/776*100).toFixed(3)}vh)`, // Reduced height to give more space to observations
      display: 'flex',
      flexDirection: 'column',
      gap: `${(12/1536*100).toFixed(3)}vw`
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: `${(8/776*100).toFixed(3)}vh`
      }}>
        <h3 style={{
          margin: 0,
          fontSize: `${(16/1536*100).toFixed(3)}vw`,
          fontWeight: '600',
          color: '#242424',
          fontFamily: 'Roboto, Arial, sans-serif'
        }}>
          Data
        </h3>
        
        {/* Format Toggle Button */}
        <button
          onClick={toggleFormat} // Change format on click
          style={{
            background: '#484848',
            border: `${(1/1536*100).toFixed(3)}vw solid #D0D0D0`,
            padding: `${(8/776*100).toFixed(3)}vh ${(12/1536*100).toFixed(3)}vw`,
            fontSize: `${(12/1536*100).toFixed(3)}vw`,
            fontWeight: '500',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontFamily: 'Roboto Mono, monospace',
            transition: 'all 0.2s ease-in-out',
            width: `${(80/1536*100).toFixed(3)}vw`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#8C8C8C'; // Change background on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#484848';
          }}
        >
          {coordinateFormat === 'decimal' ? 'DMS' : 'Decimal'} {/* Toggle text based on current format */}
        </button>
      </div>

      {/* Data Items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.55vh',
        flex: 1
      }}>
        {/* Latitude */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.91vw',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Latitude:
          </span>
          <span style={{
            fontSize: '0.91vw',
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
            fontSize: '0.91vw',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Longitude:
          </span>
          <span style={{
            fontSize: '0.91vw',
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
            fontSize: '0.91vw',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Altitude:
          </span>
          <span style={{
            fontSize: '0.91vw',
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
            fontSize: '0.91vw',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            Pipe Diameter:
          </span>
          <span style={{
            fontSize: '0.91vw',
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