const { chat } = require("./groq");

function safeParse(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return null;
    }

    return JSON.parse(
      text.substring(start, end + 1)
    );

  } catch {
    return null;
  }
}

async function analyzeMood(text) {

  const llm = await chat([
    {
      role: "system",
      content: `
You are a STRICT JSON music mood engine.

Output ONLY JSON.

{
 "mood":"",
 "ai_query":"",
 "intent":"music"
}
`
    },
    {
      role: "user",
      content: text
    }
  ]);

  const content =
    llm?.choices?.[0]?.message?.content || "";

  const parsed = safeParse(content);

  if (!parsed) {
    return {
      mood: "neutral",
      ai_query: "chill ambient music",
      intent: "music"
    };
  }

  return parsed;
}

module.exports = {
  analyzeMood
};
