const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');

const execPromise = util.promisify(exec);

async function main() {
  const inputFile = process.argv.find(arg => arg === '--input') 
    ? process.argv[process.argv.indexOf('--input') + 1] 
    : 'output/script.txt';
  const outputFile = process.argv.find(arg => arg === '--output')
    ? process.argv[process.argv.indexOf('--output') + 1]
    : 'output/voiceover.mp3';

  const script = fs.readFileSync(inputFile, 'utf-8');
  const voice = 'en-US-JennyNeural';
  const escaped = script.replace(/"/g, '\\"').replace(/\n/g, ' ');
  const cmd = `edge-tts --voice "${voice}" --text "${escaped}" --write-media ${outputFile}`;

  await execPromise(cmd);
  console.log(`✅ Voiceover saved to ${outputFile}`);
}

main().catch(err => { console.error(err); process.exit(1); });
