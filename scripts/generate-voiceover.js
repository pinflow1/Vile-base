const { EdgeTTS } = require('voipi/edge-tts');
const fs = require('fs');

async function main() {
  const inputFile = process.argv.find(arg => arg === '--input')
    ? process.argv[process.argv.indexOf('--input') + 1]
    : 'output/script.txt';
  const outputFile = process.argv.find(arg => arg === '--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : 'output/voiceover.mp3';

  let scriptText = fs.readFileSync(inputFile, 'utf8').trim();
  if (!scriptText) {
    scriptText = "Vile analyzes your diffs and predicts runtime failures.";
  }

  const tts = new EdgeTTS();
  const audioBuffer = await tts.save(scriptText, outputFile, {
    voice: 'en-US-JennyNeural'
  });
  console.log(`✅ Voiceover saved to ${outputFile}`);
}

main().catch(err => { console.error(err); process.exit(1); });
