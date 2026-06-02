const { addChunk, getBufferText } = require("./audio.buffer");
const { transcribeAudio } = require("../services/stt.engine");
const { analyzeIntent } = require("../services/llm.engine");
const { searchMusic } = require("../services/music.engine");

/**
 * MAIN PIPELINE
 * - menerima audio chunk
 * - simpan ke buffer
 * - kalau cukup → STT
 * - lalu AI → music
 */
async function handleAudioStream(sessionId, chunk) {
  if (!sessionId) return null;

  // =========================
  // 1. STORE AUDIO
  // =========================
  addChunk(sessionId, chunk);

  const bufferSize = getBufferBufferSize(sessionId);

  // kirim partial kalau masih kecil
  if (bufferSize < 5) {
    return {
      partial: "[listening...]"
    };
  }

  // =========================
  // 2. STT (batch approximation)
  // =========================
  const text = await transcribeAudio(sessionId);

  if (!text || text.length < 2) {
    return {
      partial: ""
    };
  }

  // =========================
  // 3. AI INTENT ANALYSIS
  // =========================
  const ai = await analyzeIntent(text);

  // =========================
  // 4. DECIDE IF FINAL
  // =========================
  const isFinal = text.length > 10;

  if (!isFinal) {
    return {
      partial: text
    };
  }

  // =========================
  // 5. MUSIC ENGINE
  // =========================
  const track = await searchMusic(ai.query || "lofi chill");

  return {
    final: true,
    text,
    ai,
    track
  };
}

module.exports = {
  handleAudioStream
};
