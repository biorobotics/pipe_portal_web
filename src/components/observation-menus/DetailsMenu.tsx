'use client';

import React, { useState } from 'react';
import ClockSelector from '../ClockSelector';

interface DetailsMenuProps {
  family: string;
  group: string;
  descriptor: string;
  onSubmit: (remark: string, clockPosition: number) => void;
  onCancel: () => void;
}

export default function DetailsMenu({ 
  family, 
  group, 
  descriptor, 
  onSubmit, 
  onCancel 
}: DetailsMenuProps) {
  const [remark, setRemark] = useState('');
  const [clockPosition, setClockPosition] = useState(12); // Default to 12 o'clock

  const handleSubmit = () => {
    onSubmit(remark, clockPosition);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '2.06vh'
    }}>
      {/* Remark Input */}
      <div style={{
        marginBottom: '3.09vh'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '1.03vh',
          color: '#ffffff',
          fontSize: '0.91vw',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Remark
        </label>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter details about the observation..."
          style={{
            width: '100%',
            padding: '1.55vh',
            background: '#000000',
            border: '0.13vh solid #ccc',
            borderRadius: '0.52vh',
            fontSize: '0.91vw',
            fontFamily: 'Roboto, sans-serif'
          }}
        />
      </div>

      {/* Clock Selector */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '3.09vh'
      }}>
        <label style={{
          marginBottom: '1.55vh',
          color: '#ffffff',
          fontSize: '0.91vw',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Select Clock Position
        </label>
        <ClockSelector
          selectedHour={clockPosition}
          onHourChange={setClockPosition}
          size={180}
        />
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1.55vh',
        marginTop: 'auto'
      }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '1.55vh',
            background: '#ff2400',
            border: 'none',
            borderRadius: '0.52vh',
            color: '#ffffff',
            fontSize: '0.91vw',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e02000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ff2400';
          }}
        >
          Submit
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '1.55vh',
            background: '#666666',
            border: 'none',
            borderRadius: '0.52vh',
            color: '#ffffff',
            fontSize: '0.91vw',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#777777';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#666666';
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 