import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';
import { VileLogo } from './VileLogo';

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeOutBack = Easing.bezier(0.34, 1.56, 0.64, 1);
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1);
const easeOutQuint = Easing.bezier(0.23, 1, 0.32, 1);

type Scene = {
  type: string;
  keyword: string;
  supporting?: string;
  duration: number;
};

const HookScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationFrames);
  const scale = interpolate(progress, [0, 0.6, 1], [0.3, 1.2, 1], { easing: easeOutBack });
  const blur = interpolate(progress, [0, 0.5, 1], [20, 5, 0]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity, textAlign: 'center' }}>
        <div style={{ color: '#00E5FF', fontSize: 24, letterSpacing: 4, marginBottom: 20 }}>// THE HOOK</div>
        <h1 style={{ color: 'white', fontSize: 72, fontWeight: 900, textShadow: '0 0 40px #00E5FF', marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#aaa', fontSize: 32 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationFrames);
  const shakeX = Math.sin(frame * 0.5) * 5 * (1 - progress);
  const redGlow = progress < 0.5 ? progress * 0.8 : (1 - progress) * 0.8;
  const opacity = progress;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `translateX(${shakeX}px)`, opacity, textAlign: 'center' }}>
        <div style={{ color: '#FF0055', fontSize: 24, letterSpacing: 4, marginBottom: 20, textShadow: `0 0 ${redGlow * 30}px #FF0055` }}>// THE PROBLEM</div>
        <h1 style={{ color: 'white', fontSize: 64, fontWeight: 900, textShadow: `0 0 ${redGlow * 20}px #FF0055`, marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#FF8888', fontSize: 28 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

const SolutionScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationFrames);
  const y = interpolate(progress, [0, 1], [30, 0], { easing: easeOutExpo });
  const scale = interpolate(progress, [0, 0.5, 1], [0.95, 1.05, 1]);
  const opacity = progress;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity, textAlign: 'center' }}>
        <div style={{ color: '#00FFAA', fontSize: 24, letterSpacing: 4, marginBottom: 20 }}>// THE SOLUTION</div>
        <h1 style={{ color: 'white', fontSize: 80, fontWeight: 900, textShadow: '0 0 40px #00FFAA', marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#aaa', fontSize: 30 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

const Demoscene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationFrames);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { easing: easeOutExpo });
  const scale = interpolate(progress, [0, 0.5, 1], [0.9, 1.05, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
        <div style={{ color: '#00E5FF', fontSize: 20, letterSpacing: 4, marginBottom: 20 }}>// HOW IT WORKS</div>
        <h1 style={{ color: 'white', fontSize: 56, fontWeight: 900, textShadow: '0 0 20px #00E5FF', marginBottom: 20 }}>{keyword}</h1>
        <p style={{ color: '#aaa', fontSize: 28 }}>{supporting}</p>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationFrames);
  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.1, 1], { easing: easeOutBack });
  const opacity = progress;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 72, fontWeight: 900, textShadow: '0 0 40px #00E5FF', marginBottom: 20 }}>{keyword}</h1>
        {supporting && <p style={{ color: '#00E5FF', fontSize: 32 }}>{supporting}</p>}
      </div>
    </AbsoluteFill>
  );
};

export const VileComposition: React.FC<{ scenes?: Scene[] }> = ({ scenes = [] }) => {
  if (!scenes.length) return null; // will not happen if data flow is correct

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
      <div style={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.4, zIndex: 20 }}>
        <VileLogo size={50} />
      </div>
      {children}
    </AbsoluteFill>
  );
};
