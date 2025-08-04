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

  // Generate sample data if none provided
  const graphData = data.length > 0 ? data : Array.from({ length: 50 }, (_, i) => ({
    time: (i / 49) * totalDuration,
    value: Math.random() * 8
  }));

  // Find min and max values for scaling
  const values = graphData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  // Convert data points to SVG coordinates
  const points = graphData.map((point, index) => {
    const x = padding + (point.time / totalDuration) * (width - 2 * padding);
    const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Create path for the line
  const pathData = points.split(' ').map((point, index) => {
    const [x, y] = point.split(',').map(Number);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Current time indicator
  const currentTimeX = padding + (currentTime / totalDuration) * (width - 2 * padding);

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
            00:00:00
          </div>
          <div style={{
            fontSize: '9px',
            color: '#666666',
            fontFamily: 'Roboto Mono, monospace'
          }}>
            01:02:48
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


      </svg>
    </div>
  );
} 