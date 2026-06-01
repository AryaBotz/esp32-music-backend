const fetch = require("node-fetch");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function analyzeWithLLM(text) {
  const prompt = `
You are a strict emotion classifier.

Analyze user text and return ONLY valid JSON.

Allowed moods:
- sad
- happy
- focus
- sleep
- neutral

Allowed intents:
- music
- question
- command

RULES:
- Return ONLY JSON
- No markdown
- No explanation

Format:
{
  "mood": "sad|happy|focus|sleep|neutral",
  "intent": "music|question|command"
}

User text:
${text}
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });

  const data = await res.json();

  let content = data?.choices?.[0]?.message?.content;

  console.log("RAW LLM:", content);

  try {
    return JSON.parse(content);
  } catch (err) {
    console.log("LLM PARSE ERROR:", content);
    return {
      mood: "neutral",
      intent: "music"
    };
  }
}

module.exports = { analyzeWithLLM };
