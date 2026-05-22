import React from 'react';
import { Composition } from 'remotion';
import { VileComposition } from './VileComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VileComposition"
        component={VileComposition}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scriptText: 'Vile analyzes your diffs and predicts runtime failures.',
          audioUrl: '',
        }}
      />
    </>
  );
};
