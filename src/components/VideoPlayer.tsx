/**
 * @fileoverview VideoPlayer component for interactive video playback with timeline, controls, and observation markers.
 * Controls include play/pause, rewind, fast forward, and playback speed selection.
 * Integrates with VideoContext for playback state and speed. Used to control and visualize video progress in the portal UI.
 * Uses client-side rendering.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useVideo } from '../contexts/VideoContext';


/**
 * Observation data structure for timeline markers.
 * @property id - Unique identifier for the observation.
 * @property time - Time (in seconds) of the observation in the video.
 * @property title - Title of the observation.
 */
interface Observation {
  id: string;
  time: number;
  title: string;
}


/**
 * Props for the VideoPlayer component.
 * @property currentTime - The current playback time in seconds.
 * @property totalDuration - The total duration of the video in seconds.
 * @property observations - Array of observations to mark on the timeline.
 * @property onTimeChange - Callback when the playback time changes.
 * @property onObservationClick - Callback when an observation marker is clicked.
 */
interface VideoPlayerProps {
  currentTime: number;
  totalDuration: number;
  observations: Observation[];
  onTimeChange: (time: number) => void;
  onObservationClick: (observationId: string) => void;
}

/**
 * VideoPlayer component for interactive video playback with timeline, controls, and observation markers.
 * Integrates with VideoContext for playback state and speed.
 *
 * @param currentTime - The current playback time in seconds.
 * @param totalDuration - The total duration of the video in seconds.
 * @param observations - Array of observations to mark on the timeline.
 * @param onTimeChange - Callback when the playback time changes.
 * @param onObservationClick - Callback when an observation marker is clicked.
 * @returns The video player UI with timeline and controls.
 */
export default function VideoPlayer({ 
  currentTime, 
  totalDuration, 
  observations, 
  onTimeChange, 
  onObservationClick 
}: VideoPlayerProps) {
  const { isPlaying, setIsPlaying, playbackSpeed, setPlaybackSpeed } = useVideo();
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];


  /**
   * Formats a time value in seconds as HH:MM:SS.
   * @param seconds - Time in seconds.
   * @returns Formatted time string.
   */
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  /**
   * Handles click on the timeline to seek to a new time.
   * @param event - Mouse event from the timeline div.
   */
  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!isDragging) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * totalDuration;
      onTimeChange(newTime);
    }
  };


  /**
   * Handles mouse down event to start dragging the timeline.
   * @param event - Mouse event from the timeline div.
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  /**
   * Handles mouse move event to update the timeline while dragging.
   * @param event - Mouse event from the document.
   */
  const handleMouseMove = (event: MouseEvent): void => {
    if (isDragging && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * totalDuration;
      onTimeChange(newTime);
    }
  };


  /**
   * Handles mouse up event to stop dragging the timeline.
   */
  const handleMouseUp = (): void => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };


  /**
   * Cleans up mouse event listeners on unmount or when dragging state changes.
   */
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);


  /**
   * Handles rewind button click to go back 10 seconds.
   */
  const handleRewind = (): void => {
    const newTime = Math.max(0, currentTime - 10);
    onTimeChange(newTime);
  };


  /**
   * Handles fast forward button click to go forward 10 seconds.
   */
  const handleFastForward = (): void => {
    const newTime = Math.min(totalDuration, currentTime + 10);
    onTimeChange(newTime);
  };


  /**
   * Handles play/pause button click to toggle playback state.
   */
  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };


  /**
   * Handles playback speed change from the speed menu.
   * @param speed - The new playback speed to set.
   */
  const handleSpeedChange = (speed: number): void => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  return (
    <div style={{
      background: '#242424',
      border: '0.13vh solid #444',
      borderRadius: '0',
      padding: '2.06vh',
      width: '100%',
    }}>
      {/* Timeline */}
      <div 
        ref={timelineRef}
        style={{
          position: 'relative',
          height: '5.15vh',
          background: '#333',
          border: '0.13vh solid #555',
          borderRadius: '0',
          marginBottom: '2.06vh',
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
          borderRadius: '0.52vh'
        }} />

        {/* Current time indicator */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${(currentTime / totalDuration) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '1.04vw',
          height: '2.06vh',
          background: '#ff2400',
          borderRadius: '50%',
          border: '0.26vh solid #fff',
          cursor: 'grab',
          boxShadow: '0 0.26vh 0.52vh rgba(0,0,0,0.3)'
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
              width: '0.78vw',
              height: '1.55vh',
              background: '#ffd700',
              borderRadius: '50%',
              cursor: 'pointer',
              border: '0.26vh solid #fff',
              boxShadow: '0 0.26vh 0.52vh rgba(0,0,0,0.2)'
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
          bottom: '-2.58vh',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.78vw',
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
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        position: 'relative'
      }}>
        {/* Centered main controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.04vw',
          flex: 1
        }}>
          {/* Rewind button */}
          <button
            onClick={handleRewind}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '1.03vh',
              borderRadius: '0.52vh',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6B6B6B';
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
              padding: '1.55vh',
              borderRadius: '50%',
              width: '3.13vw',
              height: '6.19vh',
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
              padding: '1.03vh',
              borderRadius: '0.52vh',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6B6B6B';
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

        {/* Playback Speed Control - positioned at bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            style={{
              background: 'transparent',
              border: '0.13vh solid #666',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '1.03vh 0.78vw',
              borderRadius: '0.52vh',
              fontSize: '0.78vw',
              fontFamily: 'Roboto Mono, monospace',
              minWidth: '3.91vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.52vw'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#888';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#666';
            }}
          >
            <span>{playbackSpeed}x</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>

          {/* Speed Menu Dropdown */}
          {showSpeedMenu && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '0',
              right: '0',
              background: '#333',
              border: '0.13vh solid #555',
              borderRadius: '0.52vh',
              marginBottom: '0.52vh',
              zIndex: 1000,
              boxShadow: '0 0.52vh 1.03vh rgba(0,0,0,0.3)'
            }}>
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  style={{
                    width: '100%',
                    background: speed === playbackSpeed ? '#ff2400' : 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '1.03vh 0.78vw',
                    fontSize: '0.78vw',
                    fontFamily: 'Roboto Mono, monospace',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (speed !== playbackSpeed) {
                      e.currentTarget.style.background = '#444';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (speed !== playbackSpeed) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Close speed menu when clicking outside */}
      {showSpeedMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowSpeedMenu(false)}
        />
      )}
    </div>
  );
} 