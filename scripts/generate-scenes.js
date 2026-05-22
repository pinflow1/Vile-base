const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  console.log('[1/3] Generating script and scenes...');

  const prompt = `You are a video director. Generate both a raw script AND a scene-by-scene JSON for a vertical video about "Vile" – an AI code safety engine.

First, write a short, punchy script (under 400 chars) for a 15-second TikTok/Reels video. Use dark, developer-focused language. Hook urgent, problem painful, solution powerful.

Then, convert that exact script into a scene JSON array with these fields:
- type: "hook" (1.5s), "problem" (2.5s), "solution" (2s), "demo" (2.5s), "cta" (2s)
- keyword: 1-3 word bold phrase
- supporting: optional subtext

Output format:
---SCRIPT---
[the raw script text]
---JSON---
[valid JSON array only, no extra text]

Example JSON:
[
  {"type":"hook","keyword":"WHAT IF","supporting":"you never shipped a bug?"},
  {"type":"problem","keyword":"SILENT CRASHES","supporting":"cost you users"},
  {"type":"solution","keyword":"VILE","supporting":"AI code safety engine"},
  {"type":"demo","keyword":"ANALYZES DIFFS","supporting":"predicts failures before deploy"},
  {"type":"cta","keyword":"TRY VILE","supporting":"vile-web.vercel.app"}
]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });

  const response = completion.choices[0].message.content;
  
  // Extract script (between ---SCRIPT--- and ---JSON---)
  const scriptMatch = response.match(/---SCRIPT---\n([\s\S]*?)\n---JSON---/);
  const jsonMatch = response.match(/---JSON---\n([\s\S]*?)$/);
  
  if (!scriptMatch || !jsonMatch) {
    throw new Error('Failed to parse response from Groq');
  }
  
  const script = scriptMatch[1].trim();
  const scenes = JSON.parse(jsonMatch[1].trim());
  
  fs.writeFileSync('output/script.txt', script);
  fs.writeFileSync('output/scenes.json', JSON.stringify(scenes, null, 2));
  
  console.log(`✅ Script saved (${script.length} chars)`);
  console.log(`✅ Scenes saved: ${scenes.map(s => s.type).join(' → ')}`);
}

main().catch(err => { console.error(err); process.exit(1); });
