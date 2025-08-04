'use client';

import { useState, useRef, useEffect } from 'react';
import { useVideo } from '../contexts/VideoContext';

interface Observation {
  id: string;
  time: number;
  title: string;
}

interface VideoPlayerProps {
  currentTime: number;
  totalDuration: number;
  observations: Observation[];
  onTimeChange: (time: number) => void;
  onObservationClick: (observationId: string) => void;
}

export default function VideoPlayer({ 
  currentTime, 
  totalDuration, 
  observations, 
  onTimeChange, 
  onObservationClick 
}: VideoPlayerProps) {
  const { isPlaying, setIsPlaying } = useVideo();
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * totalDuration;
      onTimeChange(newTime);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * totalDuration;
      onTimeChange(newTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleRewind = () => {
    const newTime = Math.max(0, currentTime - 10);
    onTimeChange(newTime);
  };

  const handleFastForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 10);
    onTimeChange(newTime);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{
      background: '#242424',
      border: '1px solid #444',
      borderRadius: '0px',
      padding: '16px',
      width: '100%'
    }}>
      {/* Timeline */}
              <div 
          ref={timelineRef}
          style={{
            position: 'relative',
            height: '40px',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '0px',
            marginBottom: '16px',
            cursor: 'pointer'
          }}
          onClick={handleTimelineClick}
          onMouseDown={handleMouseDown}
        >
        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          width: `${(currentTime / totalDuration) * 100}%`,
          background: '#ff2400',
          borderRadius: '4px'
        }} />

        {/* Current time indicator */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${(currentTime / totalDuration) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '16px',
          height: '16px',
          background: '#ff2400',
          borderRadius: '50%',
          border: '2px solid #fff',
          cursor: 'grab',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }} />

        {/* Observation markers */}
        {observations.map((observation) => (
          <div
            key={observation.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${(observation.time / totalDuration) * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              background: '#ffd700',
              borderRadius: '50%',
              cursor: 'pointer',
              border: '2px solid #fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onObservationClick(observation.id);
            }}
            title={observation.title}
          />
        ))}

        {/* Time labels */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#ffffff',
          fontFamily: 'Roboto Mono, monospace'
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: '#ffffff'
      }}>
        {/* Rewind button */}
        <button
          onClick={handleRewind}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19,20 9,12 19,4"/>
            <line x1="5" y1="19" x2="5" y2="5"/>
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          style={{
            background: '#ff2400',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e02000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ff2400';
          }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        {/* Fast forward button */}
        <button
          onClick={handleFastForward}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,4 15,12 5,20"/>
            <line x1="19" y1="5" x2="19" y2="19"/>
          </svg>
        </button>
      </div>
    </div>
  );
} 