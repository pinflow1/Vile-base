import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';
import { VileLogo } from './VileLogo';

// Premium easing curves
const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeOutBack = Easing.bezier(0.34, 1.56, 0.64, 1);
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1);
const easeOutQuint = Easing.bezier(0.23, 1, 0.32, 1);

type SceneType = 'hook' | 'problem' | 'solution' | 'demo' | 'cta';
interface Scene {
  type: SceneType;
  keyword: string;
  supporting?: string;
  duration: number;
}

// Scene components
const HookScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: easeOutExpo });
  const scale = interpolate(progress, [0, 0.6, 1], [0.3, 1.2, 1], { easing: easeOutBack });
  const blur = interpolate(progress, [0, 0.5, 1], [20, 5, 0]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity, textAlign: 'center' }}>
        <div style={{ color: '#00E5FF', fontSize: 24, fontWeight: 500, letterSpacing: 4, marginBottom: 20 }}>// THE HOOK</div>
        <h1 style={{ color: 'white', fontSize: 72, fontWeight: 900, textShadow: '0 0 40px #00E5FF', marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#aaa', fontSize: 32, fontWeight: 400 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: easeInOutCubic });
  const glitchIntensity = Math.sin(frame * 0.5) * 8;
  const shakeX = Math.sin(frame * 15) * glitchIntensity;
  const redGlow = interpolate(Math.sin(frame * 0.3), [-1, 1], [0, 0.4]);
  const opacity = interpolate(progress, [0, 0.1, 1], [0, 1, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `translateX(${shakeX}px)`, opacity, textAlign: 'center' }}>
        <div style={{ color: '#FF0055', fontSize: 24, fontWeight: 500, letterSpacing: 4, marginBottom: 20, textShadow: `0 0 ${redGlow * 30}px #FF0055` }}>// THE PROBLEM</div>
        <h1 style={{ color: 'white', fontSize: 64, fontWeight: 900, textShadow: `0 0 ${redGlow * 20}px #FF0055`, marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#FF8888', fontSize: 28, fontWeight: 400 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: easeOutQuint });
  const y = interpolate(progress, [0, 1], [30, 0], { easing: easeOutExpo });
  const opacity = interpolate(progress, [0, 0.1, 1], [0, 1, 1]);
  const scale = interpolate(progress, [0, 0.5, 1], [0.95, 1.02, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity, textAlign: 'center' }}>
        <div style={{ color: '#00FFAA', fontSize: 24, fontWeight: 500, letterSpacing: 4, marginBottom: 20 }}>// THE SOLUTION</div>
        <h1 style={{ color: 'white', fontSize: 80, fontWeight: 900, textShadow: '0 0 40px #00FFAA', marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#aaa', fontSize: 30, fontWeight: 400 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

const Demoscene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const letters = keyword.split('');
  const words = supporting.split(' ');
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#00E5FF', fontSize: 20, fontWeight: 500, letterSpacing: 4, marginBottom: 20 }}>// HOW IT WORKS</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 30 }}>
          {letters.map((ch, i) => {
            const delay = i * 2;
            const charProgress = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: easeOutBack });
            return (
              <span key={i} style={{ opacity: charProgress, transform: `translateY(${(1 - charProgress) * 40}px)`, fontSize: 56, fontWeight: 900, color: 'white', textShadow: '0 0 20px #00E5FF' }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {words.map((word, i) => {
            const delay = 30 + i * 8;
            const wordProgress = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <span key={i} style={{ opacity: wordProgress, fontSize: 28, fontWeight: 500, color: '#aaa' }}>
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: easeOutExpo });
  const scale = interpolate(progress, [0, 0.7, 1], [0.8, 1.05, 1], { easing: easeOutBack });
  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.5, 1.5]);
  const opacity = interpolate(progress, [0, 0.1, 1], [0, 1, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 72, fontWeight: 900, textShadow: `0 0 ${40 * glowPulse}px #00E5FF`, marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#00E5FF', fontSize: 32, fontWeight: 500 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

// Main component
export const VileComposition: React.FC<{ scenes?: Scene[] }> = ({ scenes = [] }) => {
  // Calculate total duration for the composition (all scenes sum)
  let totalFrames = 0;
  for (const scene of scenes) {
    totalFrames += Math.floor(scene.duration * 30);
  }

  // Build sequences
  let currentFrame = 0;
  const children = scenes.map((scene, idx) => {
    const durationFrames = Math.floor(scene.duration * 30);
    const startFrame = currentFrame;
    currentFrame += durationFrames;

    let Component;
    switch (scene.type) {
      case 'hook': Component = HookScene; break;
      case 'problem': Component = ProblemScene; break;
      case 'solution': Component = SolutionScene; break;
      case 'demo': Component = Demoscene; break;
      case 'cta': Component = CTAScene; break;
      default: Component = HookScene;
    }

    return (
      <Sequence key={idx} from={startFrame} durationInFrames={durationFrames}>
        <Component keyword={scene.keyword} supporting={scene.supporting || ''} durationFrames={durationFrames} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Audio src={staticFile('voiceover.mp3')} />
      <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 20, opacity: 0.4 }}>
        <VileLogo size={50} />
      </div>
      {children}
    </AbsoluteFill>
  );
};
