const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function main() {
  const filePath = process.argv.find(arg => arg === '--file')
    ? process.argv[process.argv.indexOf('--file') + 1]
    : 'output/final-video.mp4';
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `vile-video-${Date.now()}.mp4`;

  const { data, error } = await supabase.storage
    .from('vile-videos')
    .upload(fileName, fileBuffer, { contentType: 'video/mp4' });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('vile-videos').getPublicUrl(fileName);
  console.log(`✅ Video uploaded. Public URL: ${urlData.publicUrl}`);
  fs.writeFileSync('output/video-url.txt', urlData.publicUrl);
}

main().catch(err => { console.error(err); process.exit(1); });
