const fs = require("fs");
const FormData = require("form-data");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// WHISPER STT (FIXED & STABLE)
// =====================
async function whisper(filePath) {
  const form = new FormData();

  // ⚠️ FIX 1: jangan pakai createReadStream tanpa cek file
  if (!fs.existsSync(filePath)) {
    throw new Error("Audio file not found: " + filePath);
  }

  const stream = fs.createReadStream(filePath);

  form.append("file", stream, {
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

  const data = await res.json().catch(() => ({}));

  console.log("[GROQ STT STATUS]", res.status);
  console.log("[GROQ STT RESPONSE]", data);

  // ⚠️ FIX 2: handle error lebih jelas
  if (!res.ok) {
    throw new Error(
      data?.error?.message ||
      JSON.stringify(data) ||
      "STT failed"
    );
  }

  // ⚠️ FIX 3: pastikan text ada
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
        temperature: 0.7,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error?.message || "LLM request failed"
    );
  }

  return data;
}

module.exports = {
  whisper,
  chat,
};
