import React from 'react';

interface AngleVisualizerProps {
  angle: number;
  size?: number;
}

export const AngleVisualizer: React.FC<AngleVisualizerProps> = ({ angle, size = 40 }) => {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Convert angle from degrees to radians, adjusting for SVG's Y-axis inversion
  const angleRad = (angle - 90) * (Math.PI / 180);

  const endX = centerX + radius * Math.cos(angleRad);
  const endY = centerY + radius * Math.sin(angleRad);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-full border border-border bg-background">
      <circle cx={centerX} cy={centerY} r={radius - 1} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      <line x1={centerX} y1={centerY} x2={endX} y2={endY} stroke="#3b82f6" strokeWidth="2" />
      <circle cx={endX} cy={endY} r="3" fill="#3b82f6" />
    </svg>
  );
};
