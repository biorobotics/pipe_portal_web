/**
 * @fileoverview VideoPanel component for displaying a video in an iframe with overlays for camera name and timestamp.
 * Integrates with VideoContext for video registration and duration tracking. Used to embed Google Drive videos in the portal UI.
 * @remark Hosting from Google Drive is a temporary solution. To see the videos, you need access to the team's shared drive. 
 * Moving forward, will need to find a way to display videos from AWS or an NAS, and sync the videos with other parts of the UI.
 * @remark Currently, the page is not able to correctly read the video's duration from Google Drive. Syncing isn't working either.
 */
'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useVideo } from '../contexts/VideoContext';


/**
 * Props for the VideoPanel component.
 * @property vidFile - The video file name or path.
 * @property vidLink - Optional Google Drive video ID (defaults based on vidFile).
 * @property timestamp - Timestamp to display as overlay.
 * @property width - CSS width for the panel (default: 100%).
 * @property height - CSS height for the panel (default: 100%).
 */
interface VideoPanelProps {
  vidFile: string;
  vidLink?: string;
  timestamp: string;
  width?: string;
  height?: string;
}

export default function VideoPanel({
  vidFile,
  vidLink = (vidFile == 'visual_output.mp4') ? '1PMKplMM89LThYJf9Z_9I1cD070FhxsqX' : '13TeqmmMAbvJ2YCuLBnWaxyVgPXXqF4Tz',
  timestamp, 
  width = '100%',
  height = '100%'
}: VideoPanelProps) {
  /**
   * Video context methods for registration and duration tracking.
   */
  const { registerVideoElement, unregisterVideoElement, setTotalDuration } = useVideo();
  /**
   * Ref to the iframe element for video registration.
   */
  const iframeRef = useRef<HTMLIFrameElement>(null);
  /**
   * Display name for the video, extracted from the file path.
   */
  const displayName = useMemo(() => vidFile.split('/').pop()?.split('?')[0] || '', [vidFile]);

  /**
   * Registers the iframe video element and listens for duration messages from the iframe.
   * Cleans up on unmount.
   * @returns Cleanup function for unregistering and removing event listeners.
   */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      registerVideoElement(iframe);
      /**
       * Handles messages from the iframe to set total video duration.
       * @param event - MessageEvent from the iframe.
       */
      const handleMessage = (event: MessageEvent) => {
        if (event.source === iframe.contentWindow) {
          const data = event.data;
          if (data.type === 'duration') {
            setTotalDuration(data.value);
          }
        }
      };

      // Listen for messages from the iframe
      window.addEventListener('message', handleMessage);
      return () => {
        unregisterVideoElement(iframe);
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [registerVideoElement, unregisterVideoElement, setTotalDuration]);

  return (
    <div style={{
      position: 'relative',
      width,
      height,
      background: '#000',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Video Element */}
      <iframe 
        ref={iframeRef}
        src={`https://drive.google.com/file/d/${vidLink}/preview`}
        onLoad={(e) => {
          const iframe = e.currentTarget;
          if (iframe) {
            registerVideoElement(iframe);
          }
        }}
        width="100%" 
        height="100%" 
        allow="autoplay">  
      </iframe>
      
      {/* Camera name overlay */}
      <div style={{
        position: 'absolute',
        top: '1.03vh',
        left: '0.52vw',
        background: 'rgba(255, 0, 0, 0.6)',
        color: '#fff',
        padding: '0.52vh 0.52vw',
        fontSize: '0.78vw',
        fontWeight: '500',
        fontFamily: 'var(--font-pixelify-sans), Pixelify Sans, sans-serif',
        borderRadius: '0.26vh',
        zIndex: 10
      }}>
        {displayName}
      </div>

      {/* Timestamp overlay */}
      <div style={{
        position: 'absolute',
        bottom: '1.03vh',
        right: '0.52vw',
        background: 'rgba(255, 0, 0, 0.6)',
        color: '#fff',
        padding: '0.52vh 0.52vw',
        fontSize: '0.78vw',
        fontWeight: '500',
        fontFamily: 'var(--font-pixelify-sans), Pixelify Sans, sans-serif',
        borderRadius: '0.26vh',
        zIndex: 10
      }}>
        {timestamp}
      </div>
    </div>
  );
} 