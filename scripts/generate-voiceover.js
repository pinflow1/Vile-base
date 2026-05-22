const fs = require('fs');
const { EdgeTTS } = require('voipi/edge-tts');

async function main() {
  const inputFile = process.argv.find(arg => arg === '--input')
    ? process.argv[process.argv.indexOf('--input') + 1]
    : 'output/script.txt';
  const outputFile = process.argv.find(arg => arg === '--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : 'output/voiceover.mp3';

  let scriptText = fs.readFileSync(inputFile, 'utf8');
  scriptText = scriptText.trim();

  if (!scriptText) {
    console.warn('⚠️ Script empty, using fallback.');
    scriptText = "Vile analyzes your diffs and predicts runtime failures. Try Vile today.";
  }

  console.log(`📄 Script length: ${scriptText.length}`);
  console.log(`🎙️ Generating voiceover for: "${scriptText.substring(0, 60)}..."`);

  const tts = new EdgeTTS();
  const audioBuffer = await tts.save(scriptText, outputFile, {
    voice: 'en-US-JennyNeural'
  });

  console.log(`✅ Voiceover saved to ${outputFile}`);
}

main().catch(err => {
  console.error('❌ Voiceover generation failed:', err);
  process.exit(1);
});
