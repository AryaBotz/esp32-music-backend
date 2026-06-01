const FormData = require("form-data");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// WHISPER STT
// =====================
async function whisper(fileStream) {

  const form = new FormData();

form.append(
  "file",
  fileStream,
  {
    filename: "audio.mp3",
    contentType: "audio/mpeg"
  }
);

form.append("model", "whisper-large-v3");
  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    }
  );

  const data = await res.json();

  console.log(
    "[GROQ STT STATUS]",
    res.status
  );

  console.log(
    "[GROQ STT RESPONSE]",
    JSON.stringify(data, null, 2)
  );

  return data;
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
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages
      })
    }
  );

  const data = await res.json();

  return data;
}

module.exports = {
  whisper,
  chat
};
