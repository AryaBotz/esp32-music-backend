const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// WHISPER STT
// =====================
async function whisper(fileStream) {

  const FormData = require("form-data");
  const form = new FormData();

  form.append("file", fileStream);
  form.append("model", "whisper-large-v3");

  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: form
    }
  );

  return await res.json();
}

// =====================
// LLM CHAT
// =====================
async function chat(messages) {

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages
      })
    }
  );

  return await res.json();
}

module.exports = { whisper, chat };
