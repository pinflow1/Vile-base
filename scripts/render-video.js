const { bundle } = require('@remotion/bundler');
const { renderMedia } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

async function main() {
  const compositionId = 'VileComposition';
  const entry = './src/index.ts';
  const outputLocation = 'output/final-video.mp4';

  if (!fs.existsSync('output/voiceover.mp3')) {
    throw new Error('Voiceover file missing');
  }
  const scriptText = fs.readFileSync('output/script.txt', 'utf-8');

  // Check if src folder exists, if not create a dummy composition (fail gracefully)
  if (!fs.existsSync('./src')) {
    console.error('❌ src/ folder not found. Please add Remotion project files.');
    process.exit(1);
  }

  const bundleLocation = await bundle({
    entryPoint: path.resolve(entry),
    webpackOverride: (config) => config,
  });

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
  });

  console.log('✅ Video rendered to output/final-video.mp4');
}

main().catch(err => { console.error(err); process.exit(1); });
