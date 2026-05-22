import React from 'react';
import { AbsoluteFill, Audio, staticFile, Series, useCurrentFrame, interpolate, Easing } from 'remotion';
import { VileLogo } from './VileLogo';

// Helper: split text into sentences (by . ! ?)
const splitIntoSentences = (text: string): string[] => {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
};

// Individual scene with dynamic animation (rotates through 4 styles)
const AnimatedSentence: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const durationFrames = 90; // 3 seconds per sentence (adjust for pacing)
  const animType = index % 4; // 0=fade_scale, 1=slide_up, 2=kinetic_type, 3=glitch

  // ---- fade_scale ----
  if (animType === 0) {
    const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: Easing.out(Easing.exp) });
    const style = { opacity: progress, transform: `scale(${0.8 + progress * 0.2})` };
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
        <div style={{ color: 'white', fontSize: 48, fontWeight: 'bold', textAlign: 'center', padding: 40, textShadow: '0 0 15px #00E5FF', ...style }}>
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  // ---- slide_up ----
  if (animType === 1) {
    const progress = interpolate(frame, [0, durationFrames], [0, 1], { easing: Easing.out(Easing.quad) });
    const style = { transform: `translateY(${(1 - progress) * 80}px)`, opacity: progress };
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
        <div style={{ color: 'white', fontSize: 48, fontWeight: 'bold', textAlign: 'center', padding: 40, textShadow: '0 0 15px #00E5FF', ...style }}>
          {text}
        </div>
      </AbsoluteFill>
    );
  }

  // ---- kinetic_type (letter by letter) ----
  if (animType === 2) {
    const letters = text.split('');
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80%' }}>
          {letters.map((ch, i) => {
            const delay = i * 2;
            const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
            const translateY = interpolate(frame - delay, [0, 15], [50, 0], { extrapolateRight: 'clamp' });
            return (
              <span key={i} style={{ opacity, transform: `translateY(${translateY}px)`, fontSize: 48, fontWeight: 'bold', color: 'white', textShadow: '0 0 10px #00E5FF' }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  // ---- glitch ----
  const intensity = Math.sin(frame * 0.5) * 5;
  const style = { transform: `translateX(${intensity}px)`, textShadow: `0 0 ${Math.abs(intensity)}px #00E5FF`, opacity: 1 };
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <div style={{ color: 'white', fontSize: 48, fontWeight: 'bold', textAlign: 'center', padding: 40, ...style }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const VileComposition: React.FC<{ scriptText: string }> = ({ scriptText }) => {
  const sentences = splitIntoSentences(scriptText);
  // If no sentences, fallback
  const scenes = sentences.length ? sentences : [scriptText || 'Vile analyzes your diffs.'];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Audio src={staticFile('voiceover.mp3')} />
      {/* Optional: add VileLogo top left */}
      <div style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        <VileLogo size={80} />
      </div>
      <Series>
        {scenes.map((sentence, idx) => (
          <Series.Sequence key={idx} durationInFrames={90}>
            <AnimatedSentence text={sentence} index={idx} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
