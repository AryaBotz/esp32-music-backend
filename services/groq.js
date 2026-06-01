const fs = require("fs");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// WHISPER STT (FIX FINAL STABIL)
// =====================
async function whisper(filePath) {
  const buffer = fs.readFileSync(filePath);

  const formData = new FormData();

  const blob = new Blob([buffer], { type: "audio/mpeg" });

  formData.append("file", blob, "audio.mp3");
  formData.append("model", "whisper-large-v3");

  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    }
  );

  const data = await res.json().catch(() => ({}));

  console.log("[GROQ STT STATUS]", res.status);
  console.log("[GROQ STT RESPONSE]", data);

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return {
    text: data.text || "",
  };
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "LLM failed");
  }

  return data;
}

module.exports = { whisper, chat };
