const { bundle } = require('@remotion/bundler');
const { renderMedia, getCompositions } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('[1/6] Starting render script...');
  const compositionId = 'VileComposition';
  const entry = './src/index.ts';
  const outputLocation = 'output/final-video.mp4';

  console.log('[2/6] Checking voiceover file...');
  if (!fs.existsSync('output/voiceover.mp3')) {
    throw new Error('Voiceover file missing');
  }

  console.log('[3/6] Reading script.txt...');
  const scriptText = fs.readFileSync('output/script.txt', 'utf-8');
  console.log(`[3/6] Script length: ${scriptText.length}`);

  console.log('[4/6] Checking src folder...');
  if (!fs.existsSync('./src')) {
    throw new Error('src/ folder not found.');
  }

  console.log('[5/6] Starting Webpack bundle...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(entry),
    webpackOverride: (config) => config,
  });
  console.log(`[5/6] Bundle complete: ${bundleLocation}`);

  console.log('[6/6] Fetching compositions...');
  const compositions = await getCompositions(bundleLocation);
  const composition = compositions.find(c => c.id === compositionId);
  if (!composition) {
    throw new Error(`Composition "${compositionId}" not found.`);
  }
  console.log(`[6/6] Found composition. Duration: ${composition.durationInFrames} frames`);

  console.log('[7/7] Rendering video...');
  await renderMedia({
    codec: 'h264',
    composition,
    serveUrl: bundleLocation,
    outputLocation,
    inputProps: { scriptText },   // audio is now staticFile('voiceover.mp3')
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
