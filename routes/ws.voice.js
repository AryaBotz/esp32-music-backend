const WebSocket = require("ws");
const { handleChunk } = require("../core/stream.router");

module.exports = function voiceWS(server) {
  const wss = new WebSocket.Server({ server, path: "/ws/voice" });

  wss.on("connection", (ws) => {
    let sessionId = null;

    ws.on("message", async (msg) => {
      try {
        // init message (JSON)
        if (typeof msg === "string") {
          const data = JSON.parse(msg);
          sessionId = data.sessionId;
          return;
        }

        // binary audio chunk
        const result = await handleChunk(sessionId, msg);

        if (result?.partial) {
          ws.send(JSON.stringify({
            type: "partial",
            text: result.partial
          }));
        }

        if (result?.final) {
          ws.send(JSON.stringify({
            type: "final",
            ...result
          }));
        }

      } catch (e) {
        console.error(e);
      }
    });
  });
};
