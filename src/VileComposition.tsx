import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate } from 'remotion';

type VileCompositionProps = {
  scriptText: string;
  audioUrl: string;
};

export const VileComposition: React.FC<VileCompositionProps> = ({ scriptText, audioUrl }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 90, [0, 15, 75, 90], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={audioUrl} />
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
