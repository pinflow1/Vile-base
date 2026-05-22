const { bundle } = require('@remotion/bundler');
const { renderMedia, getCompositions } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('[1/7] Starting render script...');
  const compositionId = 'VileComposition';
  const entry = './src/index.ts';
  const outputLocation = 'output/final-video.mp4';

  console.log('[2/7] Checking voiceover file...');
  if (!fs.existsSync('output/voiceover.mp3')) {
    throw new Error('Voiceover file missing');
  }
  console.log('[2/7] Voiceover file found.');

  console.log('[3/7] Reading script.txt...');
  const scriptText = fs.readFileSync('output/script.txt', 'utf-8');
  console.log(`[3/7] Script length: ${scriptText.length}`);

  console.log('[4/7] Checking src folder...');
  if (!fs.existsSync('./src')) {
    throw new Error('src/ folder not found.');
  }
  console.log('[4/7] src folder exists.');

  console.log('[5/7] Starting Webpack bundle...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(entry),
    webpackOverride: (config) => config,
  });
  console.log(`[5/7] Bundle complete: ${bundleLocation}`);

  console.log('[6/7] Fetching available compositions...');
  const compositions = await getCompositions(bundleLocation);
  console.log(`[6/7] Found compositions: ${compositions.map(c => c.id).join(', ')}`);
  const composition = compositions.find(c => c.id === compositionId);
  if (!composition) {
    throw new Error(`Composition "${compositionId}" not found in bundle. Available: ${compositions.map(c => c.id).join(', ')}`);
  }
  console.log(`[6/7] Composition "${compositionId}" found. Duration: ${composition.durationInFrames} frames, FPS: ${composition.fps}`);

  console.log('[7/7] Rendering video (this may take several minutes)...');
  await renderMedia({
    codec: 'h264',
    composition,
    serveUrl: bundleLocation,
    outputLocation,
    inputProps: {
      scriptText,
      audioUrl: path.resolve('output/voiceover.mp3'),
      uiScreenshotUrls: [],
    },
    scale: 0.5,
    jpegQuality: 80,
    concurrency: 2,
  });

  console.log('✅ Video rendered to output/final-video.mp4');
}

const TIMEOUT_MS = 30 * 60 * 1000;
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Render timed out after 30 minutes')), TIMEOUT_MS)
);

Promise.race([main(), timeoutPromise])
  .catch(err => {
    console.error('Render failed:', err);
    process.exit(1);
  });
