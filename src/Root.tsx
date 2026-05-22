import React from 'react';
import { Composition } from 'remotion';
import { VileComposition } from './VileComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VileComposition"
      component={VileComposition}
      durationInFrames={300} // Adjust based on total scene duration
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
