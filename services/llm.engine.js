const { chat } = require("./groq");

/**
 * SAFE JSON PARSER
 */
function safeParse(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    return JSON.parse(text.substring(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * =========================
 * INTENT ANALYZER
 * =========================
 * Output:
 * {
 *   intent: "music",
 *   query: "lofi chill",
 *   mood: "relax"
 * }
 */
async function analyzeIntent(text) {
  try {
    const llm = await chat([
      {
        role: "system",
        content: `
You are a strict JSON intent engine for a voice music assistant.

Return ONLY valid JSON:

{
  "intent": "music",
  "query": "",
  "mood": ""
}

Rules:
- If user talks about food, daily life, random speech → still convert into music vibe
- Always output music-related query
- Keep query short (2–6 words)
- No explanation, no markdown, no text outside JSON
        `
      },
      {
        role: "user",
        content: text
      }
    ]);

    const content = llm?.choices?.[0]?.message?.content || "";

    const parsed = safeParse(content);

    // =========================
    // FALLBACK SAFETY
    // =========================
    if (!parsed) {
      return {
        intent: "music",
        query: "lofi chill relaxing",
        mood: "neutral"
      };
    }

    // normalize
    return {
      intent: parsed.intent || "music",
      query: parsed.query || "lofi chill",
      mood: parsed.mood || "neutral"
    };

  } catch (err) {
    console.error("[LLM ERROR]", err.message);

    return {
      intent: "music",
      query: "lofi chill",
      mood: "neutral"
    };
  }
}

module.exports = {
  analyzeIntent
};
