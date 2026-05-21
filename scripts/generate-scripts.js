const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const prompt = `Create a 30-second vertical video script for TikTok/Reels for an AI code safety tool called Vile. Vile analyzes diffs and predicts runtime failures, logical bugs, and silent crashes using Groq Llama 3.3. Keep it under 400 characters. Short punchy sentences. Hook, problem, solution, CTA. No intro. Speak directly to a developer.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const script = completion.choices[0].message.content;
  fs.writeFileSync('output/script.txt', script);
  console.log('✅ Script saved to output/script.txt');
}

main().catch(err => { console.error(err); process.exit(1); });
