const { bundle } = require('@remotion/bundler');
const { renderMedia } = require('@remotion/renderer');
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
  console.log('[2/6] Voiceover file found.');

  console.log('[3/6] Reading script.txt...');
  const scriptText = fs.readFileSync('output/script.txt', 'utf-8');
  console.log(`[3/6] Script length: ${scriptText.length}`);

  console.log('[4/6] Checking src folder...');
  if (!fs.existsSync('./src')) {
    console.error('❌ src/ folder not found.');
    process.exit(1);
  }
  console.log('[4/6] src folder exists.');

  console.log('[5/6] Starting Webpack bundle...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(entry),
    webpackOverride: (config) => config,
  });
  console.log(`[5/6] Bundle complete: ${bundleLocation}`);

  console.log('[6/6] Rendering video (this may take several minutes)...');
  await renderMedia({
    codec: 'h264',
    composition: compositionId,
    serveUrl: bundleLocation,
    outputLocation,
    inputProps: {
      scriptText,
      audioUrl: path.resolve('output/voiceover.mp3'),
      uiScreenshotUrls: [],
    },
    // Speed optimizations:
    scale: 0.5,               // render at half resolution (540x960) – much faster, still fine for testing
    jpegQuality: 80,          // lower quality for faster encoding
    concurrency: 2,           // limit parallel threads (avoid runner overload)
  });

  console.log('✅ Video rendered to output/final-video.mp4');
}

// 30-minute timeout
const TIMEOUT_MS = 30 * 60 * 1000;
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Render timed out after 30 minutes')), TIMEOUT_MS)
);

Promise.race([main(), timeoutPromise])
  .catch(err => {
    console.error('Render failed:', err);
    process.exit(1);
  });
