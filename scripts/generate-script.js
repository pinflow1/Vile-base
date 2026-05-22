const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const prompt = `Generate a scene-by-scene JSON array for a 15-second vertical video about "Vile" – an AI code safety engine.
  
Each scene must have:
- type: "hook" (1.5s), "problem" (2.5s), "solution" (2s), "demo" (2.5s), "cta" (2s)
- keyword: 1-3 word bold phrase
- supporting: optional subtext (keep short)

Output ONLY valid JSON. Example:
[
  {"type":"hook","keyword":"WHAT IF","supporting":"you never shipped a bug?"},
  {"type":"problem","keyword":"SILENT CRASHES","supporting":"cost you users"},
  {"type":"solution","keyword":"VILE","supporting":"AI code safety engine"},
  {"type":"demo","keyword":"ANALYZES DIFFS","supporting":"predicts failures before deploy"},
  {"type":"cta","keyword":"TRY VILE","supporting":"vile-web.vercel.app"}
]

Use dark, developer-focused language. Make the hook urgent, the problem painful, the solution powerful, and the CTA direct.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });

  const jsonText = completion.choices[0].message.content;
  const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON found');
  const scenes = JSON.parse(jsonMatch[0]);
  fs.writeFileSync('output/scenes.json', JSON.stringify(scenes, null, 2));
  console.log('✅ scenes.json saved');
}

main().catch(err => { console.error(err); process.exit(1); });
