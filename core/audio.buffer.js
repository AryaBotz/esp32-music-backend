const sessions = new Map();

/**
 * CREATE OR GET SESSION BUFFER
 */
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      chunks: [],
      lastText: "",
      createdAt: Date.now()
    });
  }

  return sessions.get(sessionId);
}

/**
 * ADD AUDIO CHUNK
 */
function addChunk(sessionId, chunk) {
  const session = getSession(sessionId);

  session.chunks.push(chunk);

  // 🔥 limit memory biar tidak crash
  if (session.chunks.length > 200) {
    session.chunks.shift();
  }
}

/**
 * GET RAW BUFFER SIZE (for stream logic)
 */
function getBufferBufferSize(sessionId) {
  const session = getSession(sessionId);
  return session.chunks.length;
}

/**
 * GET FULL AUDIO BUFFER (FOR STT)
 */
function getAudioBuffer(sessionId) {
  const session = getSession(sessionId);
  return Buffer.concat(session.chunks);
}

/**
 * CLEAR BUFFER AFTER PROCESSING (optional)
 */
function clearBuffer(sessionId) {
  const session = getSession(sessionId);
  session.chunks = [];
}

module.exports = {
  getSession,
  addChunk,
  getBufferBufferSize,
  getAudioBuffer,
  clearBuffer
};
