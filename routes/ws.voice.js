const WebSocket = require("ws");
const { handleAudioChunk } = require("../core/stream.router");

function voiceWS(server) {
  const wss = new WebSocket.Server({ server, path: "/ws/voice" });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    let sessionId = null;

    ws.on("message", async (msg) => {
      try {
        // ESP32 sends JSON header OR raw PCM
        if (typeof msg === "string") {
          const data = JSON.parse(msg);
          sessionId = data.sessionId;
          return;
        }

        // binary PCM chunk
        const result = await handleAudioChunk(sessionId, msg);

        if (result?.text) {
          ws.send(JSON.stringify({
            type: "partial",
            text: result.text
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

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
}

module.exports = voiceWS;
