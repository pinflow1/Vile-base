import React from 'react';
import { Composition } from 'remotion';
import { VileComposition } from './VileComposition';

// Default props for preview
const defaultScript = "Vile analyzes your diffs and predicts runtime failures before you deploy. Catch bugs early. Ship with confidence. Try Vile today.";
const defaultAudioUrl = "https://example.com/fallback.mp3"; // will be overridden by inputProps

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VileComposition"
        component={VileComposition}
        durationInFrames={900}   // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scriptText: defaultScript,
          audioUrl: defaultAudioUrl,
          uiScreenshotUrls: [],
          riskScore: 78,
          riskLevel: 'High',
        }}
      />
    </>
  );
};
