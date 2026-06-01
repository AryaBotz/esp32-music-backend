const fs = require("fs");
const { FormData, File } = require("undici");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// WHISPER STT (FIXED TOTAL)
// =====================
async function whisper(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found: " + filePath);
  }

  const buffer = fs.readFileSync(filePath);

  const form = new FormData();

  // ⚠️ IMPORTANT: pakai File dari undici, bukan Blob / form-data npm
  const file = new File([buffer], "audio.mp3", {
    type: "audio/mpeg",
  });

  form.append("file", file);
  form.append("model", "whisper-large-v3");

  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: form,
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
// CHAT
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
