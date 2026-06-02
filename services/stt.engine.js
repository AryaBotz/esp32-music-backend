const fs = require("fs");
const FormData = require("form-data");
const { getAudioBuffer, clearBuffer } = require("../core/audio.buffer");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * =========================
 * SPEECH TO TEXT (GROQ)
 * =========================
 */
async function transcribeAudio(sessionId) {
  try {
    const audioBuffer = getAudioBuffer(sessionId);

    if (!audioBuffer || audioBuffer.length === 0) {
      return "";
    }

    // =========================
    // BUILD FORM DATA
    // =========================
    const form = new FormData();

    form.append("file", audioBuffer, {
      filename: "audio.wav",
      contentType: "audio/wav"
    });

    form.append("model", "whisper-large-v3");

    // =========================
    // CALL GROQ API
    // =========================
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

    console.log("[STT STATUS]", res.status);
    console.log("[STT RESPONSE]", data);

    // =========================
    // ERROR HANDLING
    // =========================
    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    // =========================
    // CLEAN BUFFER AFTER SUCCESS
    // =========================
    clearBuffer(sessionId);

    return data.text || "";

  } catch (err) {
    console.error("[STT ERROR]", err.message);
    return "";
  }
}

module.exports = {
  transcribeAudio
};
