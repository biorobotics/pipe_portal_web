'use client';

interface VideoPanelProps {
  cameraName: string;
  timestamp: string;
  isCircular?: boolean;
  width?: string;
  height?: string;
}

export default function VideoPanel({ 
  cameraName, 
  timestamp, 
  isCircular = false,
  width = '100%',
  height = '100%'
}: VideoPanelProps) {
  return (
    <div style={{
      position: 'relative',
      width,
      height,
      background: '#000',
      borderRadius: isCircular ? '50%' : '0px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Video placeholder - using the pipe image */}
      <div style={{
        width: '100%',
        height: '100%',
        background: `url('/assets/pipe_interior.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          background: 'rgba(0, 0, 0, 0.3)'
        }} />
      </div>

      {/* Camera name overlay */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        background: 'rgba(255, 0, 0, 0.6)',
        color: '#fff',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: '500',
        fontFamily: 'var(--font-pixelify-sans), Pixelify Sans, sans-serif',
        borderRadius: '2px',
        zIndex: 10
      }}>
        {cameraName}
      </div>

      {/* Timestamp overlay */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        background: 'rgba(255, 0, 0, 0.6)',
        color: '#fff',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: '500',
        fontFamily: 'var(--font-pixelify-sans), Pixelify Sans, sans-serif',
        borderRadius: '2px',
        zIndex: 10
      }}>
        {timestamp}
      </div>
    </div>
  );
} 