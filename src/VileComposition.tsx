import React from 'react';
import { AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, interpolate, Easing, Img, spring } from 'remotion';

// ============================================================
// 1. Motion Curves (Premium Easing)
// ============================================================
const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeOutBack = Easing.bezier(0.34, 1.56, 0.64, 1);
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1);
const easeOutQuint = Easing.bezier(0.23, 1, 0.32, 1);

// ============================================================
// 2. Scene Types with Specific Animations & Durations
// ============================================================
type SceneType = 'hook' | 'problem' | 'solution' | 'demo' | 'cta';

interface Scene {
  type: SceneType;
  label?: string;
  keyword: string;
  supporting?: string;
  duration: number; // seconds
}

// ============================================================
// 3. Scene Definitions (generated from script or hardcoded)
// ============================================================
// This would come from your script generation, but here's an example:
const scenes: Scene[] = [
  { type: 'hook', keyword: 'WHAT IF...', supporting: 'you never shipped a bug?', duration: 1.5 },
  { type: 'problem', keyword: 'SILENT CRASHES', supporting: 'cost you users and trust', duration: 2.5 },
  { type: 'solution', keyword: 'VILE', supporting: 'AI code safety engine', duration: 2 },
  { type: 'demo', keyword: 'ANALYZES DIFFS', supporting: 'predicts failures before deploy', duration: 2.5 },
  { type: 'cta', keyword: 'TRY VILE', supporting: 'vile-web.vercel.app', duration: 2 },
];

// ============================================================
// 4. Scene Renderer with Premium Motion
// ============================================================
const HookScene: React.FC<{ keyword: string; supporting: string; durationFrames: number }> = ({ keyword, supporting, durationFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: easeOutExpo });
  
  // Aggressive zoom + blur
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
  
  // Glitch + shake
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
  
  // Smooth float + fade
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
  const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: easeOutExpo });
  
  // Kinetic typography – each letter pops
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
  
  // Cinematic scale + glow pulse
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

// ============================================================
// 5. Main Composition
// ============================================================
export const VileComposition: React.FC<{ scriptText?: string }> = ({ scriptText }) => {
  // You can either use the hardcoded scenes or parse from scriptText
  // For now, using hardcoded scenes for cinematic quality
  
  let currentFrame = 0;
  const sceneComponents = scenes.map((scene, idx) => {
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
      {/* Vile Logo (subtle, bottom right) */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 20, opacity: 0.3 }}>
        <Img src={staticFile('vile-logo.png')} style={{ width: 50, height: 50 }} />
      </div>
      {/* Subtle grain overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'url(/grain.png)', opacity: 0.05, pointerEvents: 'none', mixBlendMode: 'overlay' }} />
      {sceneComponents}
    </AbsoluteFill>
  );
};
