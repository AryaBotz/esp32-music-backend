const axios = require("axios");

async function analyzeWithLLM(text) {

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Return ONLY JSON:
{
  "mood": "sad|happy|focus|sleep|neutral",
  "intent": "music|question|command"
}
          `
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  let content = response.data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch {
    return { mood: "neutral", intent: "music" };
  }
}

module.exports = { analyzeWithLLM };
