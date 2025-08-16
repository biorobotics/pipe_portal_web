/**
 * @fileoverview VideoContext provides context and hooks for managing video playback, timeline, and related data.
 * Use VideoProvider to wrap components and useVideo to access or update video state, playback, and timeline data.
 */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef, useCallback } from 'react';

/**
 * Observation data structure for video timeline and gallery.
 * @property id - Unique identifier for the observation.
 * @property time - Time (in seconds) of the observation in the video.
 * @property title - Title of the observation.
 * @property subtitle - Subtitle or description.
 * @property timestamp - Timestamp string for the observation.
 * @property thumbnailUrl - URL for the observation's thumbnail image.
 */
interface Observation {
  id: string;
  time: number;
  title: string;
  subtitle: string;
  timestamp: string;
  thumbnailUrl: string;
}

/**
 * Data point for the video graph.
 * @property time - Time (in seconds) for the data point.
 * @property value - Value for the data point.
 */
interface GraphDataPoint {
  time: number;
  value: number;
}

/**
 * Type for the video context value.
 * @property currentTime - The current playback time in seconds.
 * @property totalDuration - The total duration of the video in seconds.
 * @property isPlaying - Whether the video is currently playing.
 * @property playbackSpeed - The current playback speed.
 * @property observations - Array of observations for the video.
 * @property highlightedObservation - The currently highlighted observation ID.
 * @property currentData - Current data for the video (location, altitude, etc).
 * @property graphData - Array of data points for the video graph.
 * @property setCurrentTime - Function to set the current playback time.
 * @property setTotalDuration - Function to set the total duration.
 * @property setIsPlaying - Function to set the playing state.
 * @property setPlaybackSpeed - Function to set the playback speed.
 * @property setHighlightedObservation - Function to set the highlighted observation.
 * @property formatTime - Function to format seconds as HH:MM:SS.
 * @property registerVideoElement - Function to register an iframe video element.
 * @property unregisterVideoElement - Function to unregister an iframe video element.
 */
interface VideoContextType {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  playbackSpeed: number;
  observations: Observation[];
  highlightedObservation: string | null;
  currentData: {
    latitude: number;
    longitude: number;
    altitude: number;
    pipeDiameter: number;
  };
  graphData: GraphDataPoint[];
  setCurrentTime: (time: number) => void;
  setTotalDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setHighlightedObservation: (observationId: string | null) => void;
  formatTime: (seconds: number) => string;
  registerVideoElement: (element: HTMLIFrameElement) => void;
  unregisterVideoElement: (element: HTMLIFrameElement) => void;
}

/**
 * React context for video playback and timeline state.
 */
const VideoContext = createContext<VideoContextType | undefined>(undefined);

/**
 * Provider component for VideoContext.
 * Wrap your component tree with this to provide video playback and timeline state.
 * @param children - The child components to wrap with the provider.
 * @returns The provider with video context.
 */
export function VideoProvider({ children }: { children: ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [highlightedObservation, setHighlightedObservation] = useState<string | null>(null);
  const [videoElements, setVideoElements] = useState<HTMLIFrameElement[]>([]);
  const videoElementsRef = useRef<HTMLIFrameElement[]>([]);
  const lastKnownTime = useRef<number>(0);

  /**
   * Registers an iframe video element for playback control and synchronization.
   * @param element - The iframe element to register.
   */
  const registerVideoElement = useCallback((element: HTMLIFrameElement) => {
    if (!videoElementsRef.current.includes(element)) {
      videoElementsRef.current.push(element);
      setVideoElements([...videoElementsRef.current]);
    }
  }, []);

  /**
   * Unregisters an iframe video element.
   * @param element - The iframe element to unregister.
   */
  const unregisterVideoElement = useCallback((element: HTMLIFrameElement) => {
    videoElementsRef.current = videoElementsRef.current.filter(iframe => iframe !== element);
    setVideoElements([...videoElementsRef.current]);
  }, []);

  // Handle video synchronization
  useEffect(() => {
    videoElements.forEach(iframe => {
      try {
        // Play/Pause command
        const playMessage = {
          event: 'command',
          func: isPlaying ? 'playVideo' : 'pauseVideo'
        };
        iframe.contentWindow?.postMessage(JSON.stringify(playMessage), '*');

        // Seek command (only if time changed significantly)
        if (Math.abs(currentTime - lastKnownTime.current) > 0.5) {
          const seekMessage = {
            event: 'command',
            func: 'seekTo',
            args: [currentTime, true]
          };
          iframe.contentWindow?.postMessage(JSON.stringify(seekMessage), '*');
          lastKnownTime.current = currentTime;
        }

        // Playback speed command
        const speedMessage = {
          event: 'command',
          func: 'setPlaybackRate',
          args: [playbackSpeed]
        };
        iframe.contentWindow?.postMessage(JSON.stringify(speedMessage), '*');
      } catch (error) {
        console.error('Error sending message to iframe:', error);
      }
    });
  }, [isPlaying, currentTime, playbackSpeed, videoElements]);

  // Listen for messages from iframes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!videoElementsRef.current.some(iframe => event.source === iframe.contentWindow)) {
        return;
      }

      try {
        let data;
        if (typeof event.data === 'string') {
          // Skip trying to parse if it starts with '!_'
          if (event.data.startsWith('!_')) {
            return;
          }
          try {
            data = JSON.parse(event.data);
          } catch {
            // If parsing fails, try to use the data as is
            data = event.data;
          }
        } else {
          data = event.data;
        }
        
        // Only proceed if we have valid data
        if (!data || typeof data !== 'object') {
          return;
        }

        switch (data.event) {
          case 'infoDelivery':
            if (data.info && typeof data.info.currentTime === 'number') {
              // Only update if it's significantly different
              if (Math.abs(data.info.currentTime - currentTime) > 0.5) {
                setCurrentTime(data.info.currentTime);
              }
            }
            if (data.info?.duration !== undefined && totalDuration === 0) {
              setTotalDuration(data.info.duration);
            }
            break;
          case 'onStateChange':
            // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
            if (data.info === 1 && !isPlaying) {
              setIsPlaying(true);
            } else if (data.info === 2 && isPlaying) {
              setIsPlaying(false);
            }
            break;
        }
      } catch (error) {
        console.error('Error handling iframe message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentTime, isPlaying, totalDuration]);


  /**
   * Formats a time value in seconds as HH:MM:SS.
   * @param seconds - Time in seconds.
   * @returns Formatted time string.
   */
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Generate graph data
  const graphData = useMemo(() => {
    const dataPoints: GraphDataPoint[] = [];
    const numPoints = 100;
    
    for (let i = 0; i < numPoints; i++) {
      const time = Number(((i / (numPoints - 1)) * totalDuration).toFixed(3));
      const value = Number((4 + Math.sin((i / (numPoints - 1)) * Math.PI * 4) * 2).toFixed(6));
      dataPoints.push({ time, value });
    }
    
    return dataPoints;
  }, [totalDuration]);

  // Generate current data
  const currentData = useMemo(() => {
    const progress = currentTime / totalDuration;
    return {
      latitude: Number((40.7128 + Math.sin(progress * Math.PI * 2) * 0.0001).toFixed(8)),
      longitude: Number((-74.0060 + Math.cos(progress * Math.PI * 2) * 0.0001).toFixed(8)),
      altitude: Number((15.5 + Math.sin(progress * Math.PI * 4) * 0.5).toFixed(6)),
      pipeDiameter: Number((45.2 + Math.cos(progress * Math.PI * 3) * 0.2).toFixed(6))
    };
  }, [currentTime, totalDuration]);

  const value: VideoContextType = {
    currentTime,
    totalDuration,
    isPlaying,
    playbackSpeed,
    observations: [],  // Add your observations here
    highlightedObservation,
    currentData,
    graphData,
    setCurrentTime,
    setTotalDuration,
    setIsPlaying,
    setPlaybackSpeed,
    setHighlightedObservation,
    formatTime,
    registerVideoElement,
    unregisterVideoElement
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

/**
 * Custom hook to access the video context.
 * Throws an error if used outside a VideoProvider.
 * @returns The video context value.
 */
export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}