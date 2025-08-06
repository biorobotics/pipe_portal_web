'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface Observation {
  id: string;
  time: number;
  title: string;
  subtitle: string;
  timestamp: string;
  thumbnailUrl: string;
}

interface GraphDataPoint {
  time: number;
  value: number;
}

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
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setHighlightedObservation: (observationId: string | null) => void;
  formatTime: (seconds: number) => string;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [highlightedObservation, setHighlightedObservation] = useState<string | null>(null);
  
  const totalDuration = 3752; // 01:02:32 in seconds

  // Generate consistent graph data spanning the full duration
  const graphData = useMemo(() => {
    const dataPoints: GraphDataPoint[] = [];
    const numPoints = 100;
    
    // Use a seed for consistent random generation
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    for (let i = 0; i < numPoints; i++) {
      const time = (i / (numPoints - 1)) * totalDuration;
      
      // Create a realistic pattern with some noise
      const progress = time / totalDuration;
      const baseValue = 4 + Math.sin(progress * Math.PI * 4) * 2;
      const noise = (seededRandom() - 0.5) * 0.5;
      const value = Math.max(0, Math.min(8, baseValue + noise));
      
      dataPoints.push({ time, value });
    }
    
    return dataPoints;
  }, [totalDuration]);

  // Generate time-based data
  const getCurrentData = (time: number) => {
    // Simulate data changes over time
    const progress = time / totalDuration;
    
    // Base values that change over time
    const baseLatitude = 40.7128;
    const baseLongitude = -74.0060;
    const baseAltitude = 15.5;
    const basePipeDiameter = 45.2;
    
    // Add some variation based on time
    const latitudeVariation = Math.sin(progress * Math.PI * 2) * 0.0001;
    const longitudeVariation = Math.cos(progress * Math.PI * 2) * 0.0001;
    const altitudeVariation = Math.sin(progress * Math.PI * 4) * 2;
    const diameterVariation = Math.cos(progress * Math.PI * 3) * 1;
    
    return {
      latitude: baseLatitude + latitudeVariation,
      longitude: baseLongitude + longitudeVariation,
      altitude: baseAltitude + altitudeVariation,
      pipeDiameter: basePipeDiameter + diameterVariation
    };
  };
  
  // Sample observations data
  const observations: Observation[] = [
    {
      id: 'obs1',
      time: 900, // 15:00
      title: 'Structural Damage',
      subtitle: 'Crack in pipe wall',
      timestamp: '15:00:00',
      thumbnailUrl: '/thumbnails/obs1.jpg'
    },
    {
      id: 'obs2',
      time: 1800, // 30:00
      title: 'Leak Detection',
      subtitle: 'Water seepage at 45° bend',
      timestamp: '30:00:00',
      thumbnailUrl: '/thumbnails/obs2.jpg'
    },
    {
      id: 'obs3',
      time: 2700, // 45:00
      title: 'Pipe Corrosion',
      subtitle: 'Severe rust detected at joint',
      timestamp: '45:00:00',
      thumbnailUrl: '/thumbnails/obs3.jpg'
    }
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-play functionality with playback speed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, totalDuration, playbackSpeed]);

  const value: VideoContextType = {
    currentTime,
    totalDuration,
    isPlaying,
    playbackSpeed,
    observations,
    highlightedObservation,
    currentData: getCurrentData(currentTime),
    graphData,
    setCurrentTime,
    setIsPlaying,
    setPlaybackSpeed,
    setHighlightedObservation,
    formatTime
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
} 