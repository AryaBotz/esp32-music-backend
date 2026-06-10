const WebSocket = require("ws");
const { handleAudioStream } = require("../core/stream.router");

module.exports = function voiceGateway(server) {
  const wss = new WebSocket.Server({
    server,
    path: "/ws/voice"
  });

  console.log("[WS] Voice gateway initialized at /ws/voice");

  wss.on("connection", (ws) => {
    console.log("[WS] Client connected");

    let sessionId = null;

    ws.on("message", async (msg) => {
      try {
        // =========================
        // 1. INIT MESSAGE (JSON)
        // =========================
        if (typeof msg === "string") {
          const data = JSON.parse(msg);

          if (data.type === "init") {
            sessionId = data.sessionId;

            ws.send(JSON.stringify({
              type: "ack",
              message: "session registered",
              sessionId
            }));
          }

          return;
        }

        // =========================
        // 2. AUDIO CHUNK (BINARY)
        // =========================
        if (!sessionId) {
          ws.send(JSON.stringify({
            type: "error",
            message: "sessionId not initialized"
          }));
          return;
        }

        const result = await handleAudioStream(sessionId, msg);

        // =========================
        // 3. PARTIAL TRANSCRIPT
        // =========================
        if (result?.partial) {
          ws.send(JSON.stringify({
            type: "partial",
            text: result.partial
          }));
        }

        // =========================
        // 4. FINAL RESULT
        // =========================
        if (result?.final) {
          ws.send(JSON.stringify({
            type: "final",
            text: result.text,
            ai: result.ai,
            track: result.track
          }));
        }

      } catch (err) {
        console.error("[WS ERROR]", err);

        try {
          ws.send(JSON.stringify({
            type: "error",
            message: err.message || "Internal server error"
          }));
        } catch (sendErr) {
          console.error("[WS SEND ERROR]", sendErr);
        }
      }
    });

    ws.on("error", (err) => {
      console.error("[WS CONNECTION ERROR]", err);
    });

    ws.on("close", () => {
      console.log("[WS] Client disconnected");
    });
  });
};
