
import React from 'react';

interface PulsatingCircleProps {
  pulse: number;
}

export const PulsatingCircle: React.FC<PulsatingCircleProps> = ({ pulse }) => {
  const scale = 1 + pulse * 0.1; // Pulsates between 0.9 and 1.1 scale
  const outerScale = 1 + pulse * 0.05;
  const opacity = 0.5 + Math.abs(pulse) * 0.2;

  return (
    <>
      {/* Outer faint pulse */}
      <div
        className="absolute w-full h-full bg-blue-500/10 rounded-full"
        style={{
          transform: `scale(${outerScale})`,
          transition: 'transform 50ms linear',
        }}
      />
      {/* Inner main circle */}
      <div
        className="absolute w-3/4 h-3/4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30"
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          transition: 'transform 50ms linear, opacity 50ms linear',
        }}
      />
    </>
  );
};
