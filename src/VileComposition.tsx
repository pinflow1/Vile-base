import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
  Easing,
} from 'remotion';
import { VileLogo } from './VileLogo';  // <-- added import

type RiskLevel = 'Low' | 'Medium' | 'High';

type VileCompositionProps = {
  scriptText: string;
  audioUrl: string;
  uiScreenshotUrls?: string[];
  riskScore?: number;
  riskLevel?: RiskLevel;
};

// Risk color mapping
const riskColor: Record<RiskLevel, string> = {
  Low: '#00FFAA',
  Medium: '#FFAA00',
  High: '#FF0055',
};

// Neon glow style
const neonGlow = (color: string) => `
  0 0 5px ${color},
  0 0 10px ${color},
  0 0 20px ${color}
`;

export const VileComposition: React.FC<VileCompositionProps> = ({
  scriptText,
  audioUrl,
  uiScreenshotUrls = [],
  riskScore = 78,
  riskLevel = 'High',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split script into sentences
  const sentences = scriptText.split(/(?<=[.!?])\s+/).filter(s => s.length > 0);
  const wordsPerSecond = 2.5; // average reading speed
  const framesPerSentence = Math.floor(fps / wordsPerSecond * 10); // roughly 4 seconds per sentence
  const currentSentenceIndex = Math.min(
    Math.floor(frame / framesPerSentence),
    sentences.length - 1
  );
  const currentSentence = sentences[currentSentenceIndex] || '';

  // Fade in/out for sentence
  const sentenceOpacity = interpolate(
    frame % framesPerSentence,
    [0, 10, framesPerSentence - 10, framesPerSentence],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Risk meter animation – grow from 0 to riskScore over 1 second (30 frames)
  const meterProgress = interpolate(
    frame,
    [0, 30],
    [0, riskScore],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Background pulsing (very subtle)
  const bgIntensity = interpolate(
    frame,
    [0, 30, 60, 90],
    [0, 0.05, 0, 0.05],
    { extrapolateRepeat: Infinity, easing: Easing.sinInOut }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Audio src={audioUrl} />

      {/* Subtle animated grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3 + bgIntensity,
        }}
      />

      {/* Vile Logo (top left) - now using animated SVG component */}
      <div style={{ position: 'absolute', top: 40, left: 20 }}>
        <VileLogo size={90} />
      </div>

      {/* Risk Meter Card (appears after 1 second) */}
      <Sequence from={30}>
        <div
          style={{
            position: 'absolute',
            top: 120,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            padding: '12px 16px',
            borderLeft: `4px solid ${riskColor[riskLevel]}`,
            fontFamily: 'monospace',
          }}
        >
          <div style={{ fontSize: 14, color: '#888', letterSpacing: 1 }}>RISK SCORE</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: riskColor[riskLevel] }}>
            {Math.floor(meterProgress)}
          </div>
          <div
            style={{
              width: 100,
              height: 4,
              backgroundColor: '#222',
              borderRadius: 2,
              marginTop: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${meterProgress}%`,
                height: '100%',
                backgroundColor: riskColor[riskLevel],
                boxShadow: neonGlow(riskColor[riskLevel]),
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: riskColor[riskLevel], marginTop: 6 }}>
            {riskLevel} RISK
          </div>
        </div>
      </Sequence>

      {/* Main animated text */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: 30,
          right: 30,
          color: 'white',
          fontSize: 42,
          fontWeight: 'bold',
          lineHeight: 1.2,
          textShadow: neonGlow('#00E5FF'),
          opacity: sentenceOpacity,
          transform: `translateY(${interpolate(frame % framesPerSentence, [0, 20], [20, 0])}px)`,
        }}
      >
        {currentSentence}
      </div>

      {/* Bottom neon bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: '#00E5FF',
          boxShadow: '0 0 20px #00E5FF',
        }}
      />

      {/* Optional UI screenshots overlay */}
      {uiScreenshotUrls.map((url, idx) => (
        <Sequence from={idx * 90} durationInFrames={120}>
          <Img
            src={url}
            style={{
              position: 'absolute',
              top: '35%',
              left: '10%',
              width: '80%',
              borderRadius: 20,
              border: `2px solid ${riskColor[riskLevel]}`,
              boxShadow: neonGlow(riskColor[riskLevel]),
              opacity: interpolate(frame, [0, 15, 105, 120], [0, 1, 1, 0]),
            }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
