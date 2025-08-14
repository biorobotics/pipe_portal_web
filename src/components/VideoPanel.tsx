'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useVideo } from '../contexts/VideoContext';

interface VideoPanelProps {
  vidFile: string;
  vidLink?: string;
  timestamp: string;
  isCircular?: boolean;
  width?: string;
  height?: string;
}

export default function VideoPanel({ 
  vidFile,
  vidLink = (vidFile == 'visual_output.mp4') ? '1PMKplMM89LThYJf9Z_9I1cD070FhxsqX' : '13TeqmmMAbvJ2YCuLBnWaxyVgPXXqF4Tz',
  timestamp, 
  isCircular = false,
  width = '100%',
  height = '100%'
}: VideoPanelProps) {
  const { registerVideoElement, unregisterVideoElement, setTotalDuration } = useVideo();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const displayName = useMemo(() => vidFile.split('/').pop()?.split('?')[0] || '', [vidFile]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      registerVideoElement(iframe);
      
      // Listen for messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.source === iframe.contentWindow) {
          const data = event.data;
          if (data.type === 'duration') {
            setTotalDuration(data.value);
          }
        }
      };

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
      borderRadius: isCircular ? '50%' : '0',
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