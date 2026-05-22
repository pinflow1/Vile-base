
import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, staticFile } from 'remotion';
import { VileLogo } from './VileLogo';

type VileCompositionProps = {
  scriptText: string;
  audioUrl: string;
};

export const VileComposition: React.FC<VileCompositionProps> = ({ scriptText, audioUrl }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 60, [0, 15, 45, 60], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={audioUrl} />
      <div style={{ position: 'absolute', top: 40, left: 20 }}>
        <VileLogo size={90} />
      </div>
      <div style={{
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 40,
        opacity,
      }}>
        {scriptText}
      </div>
    </AbsoluteFill>
  );
};
