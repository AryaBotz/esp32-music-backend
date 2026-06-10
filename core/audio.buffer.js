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
 * GET BUFFER SIZE (for stream logic)
 */
function getBufferSize(sessionId) {
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

/**
 * DELETE SESSION (cleanup)
 */
function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

/**
 * CLEANUP OLD SESSIONS (prevent memory leak)
 * Runs every 5 minutes to remove sessions older than 1 hour
 */
setInterval(() => {
  const now = Date.now();
  const ONE_HOUR = 3600000;
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > ONE_HOUR) {
      sessions.delete(sessionId);
      console.log(`[CLEANUP] Deleted expired session: ${sessionId}`);
    }
  }
}, 300000);

module.exports = {
  getSession,
  addChunk,
  getBufferSize,
  getAudioBuffer,
  clearBuffer,
  deleteSession
};
