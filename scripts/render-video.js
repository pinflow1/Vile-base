const { bundle } = require('@remotion/bundler');
const { renderMedia, getCompositions } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('[1/8] Starting render script...');
  const compositionId = 'VileComposition';
  const entry = './src/index.ts';
  const outputLocation = 'output/final-video.mp4';

  console.log('[2/8] Checking voiceover file...');
  if (!fs.existsSync('output/voiceover.mp3')) {
    throw new Error('Voiceover file missing');
  }

  console.log('[3/8] Reading script.txt...');
  const scriptText = fs.readFileSync('output/script.txt', 'utf-8');
  console.log(`[3/8] Script length: ${scriptText.length}`);

  console.log('[4/8] Checking src folder...');
  if (!fs.existsSync('./src')) {
    throw new Error('src/ folder not found.');
  }

  console.log('[5/8] Starting Webpack bundle...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(entry),
    webpackOverride: (config) => config,
  });
  console.log(`[5/8] Bundle complete: ${bundleLocation}`);

  console.log('[6/8] Fetching compositions...');
  const compositions = await getCompositions(bundleLocation);
  const composition = compositions.find(c => c.id === compositionId);
  if (!composition) {
    throw new Error(`Composition "${compositionId}" not found.`);
  }
  console.log(`[6/8] Found composition. Duration: ${composition.durationInFrames} frames`);

  console.log('[7/8] Rendering video...');
  await renderMedia({
    codec: 'h264',
    composition,
    serveUrl: bundleLocation,
    outputLocation,
    inputProps: { scriptText },
    scale: 0.5,
    jpegQuality: 80,
    concurrency: 2,
  });
  console.log('✅ Video rendered to output/final-video.mp4');

  // --- Upload to Supabase using fetch (no WebSocket) ---
  console.log('[8/8] Uploading to Supabase...');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  const fileBuffer = fs.readFileSync(outputLocation);
  const fileName = `vile-video-${Date.now()}.mp4`;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/vile-videos/${fileName}`;
  console.log(`Uploading to ${uploadUrl}`);
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'video/mp4',
    },
    body: fileBuffer,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/vile-videos/${fileName}`;
  console.log(`✅ Video uploaded. Public URL: ${publicUrl}`);
  fs.writeFileSync('output/video-url.txt', publicUrl);
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
