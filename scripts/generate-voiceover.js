const fs = require('fs');
const { EdgeTTS } = require('edge-tts-universal');

async function main() {
  const inputFile = process.argv.find(arg => arg === '--input')
    ? process.argv[process.argv.indexOf('--input') + 1]
    : 'output/script.txt';
  const outputFile = process.argv.find(arg => arg === '--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : 'output/voiceover.mp3';

  // Read script as UTF-8 string
  let scriptText = fs.readFileSync(inputFile, 'utf8');
  
  // Trim and validate
  scriptText = scriptText.trim();
  if (!scriptText || scriptText.length === 0) {
    console.warn('⚠️ Script file is empty. Using default fallback text.');
    scriptText = "Vile analyzes your code diffs and predicts runtime failures before you deploy. Catch bugs early. Ship with confidence. Try Vile today.";
  }

  console.log(`📄 Script type: ${typeof scriptText}, length: ${scriptText.length}`);
  console.log(`🎙️ Generating voiceover for: "${scriptText.substring(0, 80)}..."`);

  const voiceName = 'en-US-JennyNeural';
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
