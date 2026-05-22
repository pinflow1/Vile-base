const fs = require('fs');
const { EdgeTTS } = require('edge-tts-universal');

async function main() {
  const inputFile = process.argv.find(arg => arg === '--input')
    ? process.argv[process.argv.indexOf('--input') + 1]
    : 'output/script.txt';
  const outputFile = process.argv.find(arg => arg === '--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : 'output/voiceover.mp3';

  const scriptText = fs.readFileSync(inputFile, 'utf-8');
  const voiceName = 'en-US-JennyNeural';

  console.log(`🎙️ Generating voiceover for: "${scriptText.substring(0, 60)}..."`);

  // Correct API: create instance, call synthesize(text, voice)
  const tts = new EdgeTTS();
  const result = await tts.synthesize(scriptText, voiceName);

  const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
  fs.writeFileSync(outputFile, audioBuffer);

  console.log(`✅ Voiceover saved to ${outputFile}`);
}

main().catch(err => {
  console.error('❌ Voiceover generation failed:', err);
  process.exit(1);
});
