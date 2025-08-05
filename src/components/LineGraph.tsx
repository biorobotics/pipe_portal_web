'use client';

interface LineGraphProps {
  data: Array<{ time: number; value: number }>;
  currentTime: number;
  totalDuration: number;
  title?: string;
}

export default function LineGraph({ 
  data, 
  currentTime, 
  totalDuration, 
  title = "Title" 
}: LineGraphProps) {
  const width = 800;
  const height = 140;
  const padding = 16;

  // Use provided data or fallback to empty array
  const graphData = data.length > 0 ? data : [];

  // Find min and max values for scaling
  const values = graphData.map(d => d.value);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 8;
  const valueRange = maxValue - minValue || 1;

  // Calculate the time range for the graph
  const minTime = graphData.length > 0 ? Math.min(...graphData.map(d => d.time)) : 0;
  const maxTime = graphData.length > 0 ? Math.max(...graphData.map(d => d.time)) : totalDuration;
  const timeRange = maxTime - minTime || totalDuration;

  // Convert data points to SVG coordinates
  const points = graphData.map((point, index) => {
    const x = padding + ((point.time - minTime) / timeRange) * (width - 2 * padding);
    const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Create path for the line
  const pathData = points.split(' ').map((point, index) => {
    const [x, y] = point.split(',').map(Number);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Current time indicator
  const currentTimeX = padding + ((currentTime - minTime) / timeRange) * (width - 2 * padding);

  // Format time labels
  const formatTimeLabel = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '0px',
      padding: '16px',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#242424',
        fontFamily: 'Roboto Mono, monospace'
      }}>
        {title}
      </div>

      {/* Y-axis labels */}
      <div style={{
        position: 'absolute',
        left: '8px',
        top: '0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '28px',
        paddingBottom: '20px'
      }}>
        {[8, 7, 6, 5, 4, 3, 2, 1, 0].map(value => (
          <div key={value} style={{
            fontSize: '9px',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            {value}
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '33px',
        paddingRight: '33px'
      }}>
        <div style={{
          fontSize: '9px',
          color: '#666666',
          fontFamily: 'Roboto Mono, monospace'
        }}>
          {formatTimeLabel(minTime)}
        </div>
        <div style={{
          fontSize: '9px',
          color: '#666666',
          fontFamily: 'Roboto Mono, monospace'
        }}>
          {formatTimeLabel(maxTime)}
        </div>
      </div>

      {/* SVG Graph */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: '20px',
          left: '33px'
        }}
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(value => {
          const y = height - padding - ((value - minValue) / valueRange) * (height - 2 * padding);
          return (
            <line
              key={value}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#ddd"
              strokeWidth="1"
            />
          );
        })}

        {/* Data line */}
        <path
          d={pathData}
          stroke="#ff2400"
          strokeWidth="2"
          fill="none"
        />

        {/* Current time indicator line */}
        <line
          x1={currentTimeX}
          y1={padding}
          x2={currentTimeX}
          y2={height - padding}
          stroke="#007bff"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Current time indicator circle */}
        {graphData.length > 0 && (() => {
          const currentDataPoint = graphData.find(d => d.time >= currentTime) || graphData[graphData.length - 1];
          const currentValue = currentDataPoint ? currentDataPoint.value : 0;
          const currentY = height - padding - ((currentValue - minValue) / valueRange) * (height - 2 * padding);
          
          return (
            <circle
              cx={currentTimeX}
              cy={currentY}
              r="4"
              fill="#007bff"
              stroke="white"
              strokeWidth="2"
            />
          );
        })()}
      </svg>
    </div>
  );
} 