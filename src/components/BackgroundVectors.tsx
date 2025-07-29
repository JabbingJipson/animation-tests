import React from 'react';

const BackgroundVectors = React.memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Geometric lines and shapes */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30" 
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Main diagonal lines */}
        <line 
          x1="0" y1="0" x2="1920" y2="1080" 
          stroke="hsl(var(--glow-primary))" 
          strokeWidth="1" 
          className="animate-glow-pulse"
          style={{ animationDelay: '0s' }}
        />
        <line 
          x1="1920" y1="0" x2="0" y2="1080" 
          stroke="hsl(var(--glow-secondary))" 
          strokeWidth="1" 
          className="animate-glow-pulse"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Geometric grid */}
        <g stroke="hsl(var(--vector-secondary))" strokeWidth="0.5" opacity="0.4">
          {/* Horizontal lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <line 
              key={`h-${i}`}
              x1="0" 
              y1={180 * (i + 1)} 
              x2="1920" 
              y2={180 * (i + 1)}
              className="animate-drift"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
          {/* Vertical lines */}
          {Array.from({ length: 11 }, (_, i) => (
            <line 
              key={`v-${i}`}
              x1={192 * (i + 1)} 
              y1="0" 
              x2={192 * (i + 1)} 
              y2="1080"
              className="animate-drift"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </g>

        {/* Floating geometric shapes */}
        <g className="animate-float-slow" style={{ animationDelay: '1s' }}>
          <circle 
            cx="300" cy="200" r="4" 
            fill="hsl(var(--glow-primary))" 
            opacity="0.6"
          />
          <circle 
            cx="1600" cy="800" r="3" 
            fill="hsl(var(--glow-secondary))" 
            opacity="0.5"
          />
        </g>

        <g className="animate-drift" style={{ animationDelay: '3s' }}>
          <rect 
            x="1200" y="300" width="8" height="8" 
            fill="none" 
            stroke="hsl(var(--glow-primary))" 
            strokeWidth="1"
            opacity="0.4"
          />
          <rect 
            x="400" y="700" width="6" height="6" 
            fill="none" 
            stroke="hsl(var(--glow-secondary))" 
            strokeWidth="1"
            opacity="0.3"
          />
        </g>

        {/* Central focal lines */}
        <g stroke="hsl(var(--glow-primary))" strokeWidth="1" opacity="0.2">
          <circle 
            cx="960" cy="540" r="400" 
            fill="none"
            className="animate-glow-pulse"
            style={{ animationDelay: '4s' }}
          />
          <circle 
            cx="960" cy="540" r="200" 
            fill="none"
            className="animate-glow-pulse"
            style={{ animationDelay: '1s' }}
          />
        </g>
      </svg>
    </div>
  );
});

BackgroundVectors.displayName = 'BackgroundVectors';

export default BackgroundVectors;