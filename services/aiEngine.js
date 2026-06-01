const { chat } = require("./groq");

async function analyzeMood(text) {
  const llm = await chat([
    {
      role: "system",
      content: `
You are a STRICT JSON command generator for music system.

RULES:
- Output ONLY valid JSON
- No markdown
- No explanation

Return format:

{
  "type": "music.search",
  "query": "string",
  "energy": "low | medium | high"
}

Examples:
Input: aku mau tidur
Output: {"type":"music.search","query":"sleep ambient rain","energy":"low"}

Input: aku mau semangat
Output: {"type":"music.search","query":"phonk gym workout","energy":"high"}
`
    },
    {
      role: "user",
      content: text
    }
  ]);

  const content = llm?.choices?.[0]?.message?.content;

  console.log("[AI RAW]", content);

  if (!content) return fallback(text);

  try {
    return JSON.parse(content);
  } catch (e) {
    console.log("[AI PARSE FAIL]", e.message);
    return fallback(text);
  }
}

function fallback(text) {
  return {
    type: "music.search",
    query: text ? `${text} music` : "lofi chill beats",
    energy: "medium"
  };
}

module.exports = { analyzeMood };
