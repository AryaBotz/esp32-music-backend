const fs = require("fs");
const FormData = require("form-data");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// WHISPER STT (FIXED)
// =====================
async function whisper(filePath) {
  const form = new FormData();

  form.append("file", fs.createReadStream(filePath), {
    filename: "audio.mp3",
    contentType: "audio/mpeg",
  });

  form.append("model", "whisper-large-v3");

  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    }
  );

  const data = await res.json();

  console.log("[GROQ STT STATUS]", res.status);
  console.log("[GROQ STT RESPONSE]", data);

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// =====================
// CHAT LLM
// =====================
async function chat(messages) {
  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages,
      }),
    }
  );

  return await res.json();
}

module.exports = {
  whisper,
  chat,
};
