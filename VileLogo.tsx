// src/VileLogo.tsx
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface VileLogoProps {
  size?: number;
}

export const VileLogo: React.FC<VileLogoProps> = ({ size = 28 }) => {
  const frame = useCurrentFrame();
  // Pulse animation: 2.8s cycle at 30fps = 84 frames
  const pulse = interpolate(frame % 84, [0, 42, 84], [0.8, 1.2, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(frame % 84, [0, 42, 84], [0.3, 1, 0.3]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={{ transform: `scale(${pulse})` }}
    >
      <defs>
        <filter id="vileGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" rx="18" fill="#000" />
      {/* Outer pulsing ring */}
      <circle
        cx="50"
        cy="50"
        r="34"
        stroke={`rgba(255,255,255,${0.15 * glowIntensity})`}
        strokeWidth="12"
        fill="none"
        filter="url(#vileGlow)"
      />
      {/* Inner solid ring */}
      <circle
        cx="50"
        cy="50"
        r="34"
        stroke="white"
        strokeWidth="3"
        fill="none"
        filter="url(#vileGlow)"
      />
    </svg>
  );
};
