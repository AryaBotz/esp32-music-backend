require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

// routes
const healthRoute = require("./routes/rest.health");
const musicRoute = require("./routes/rest.music");

// websocket gateway
const voiceGateway = require("./routes/ws.voice.gateway");

const app = express();
const server = http.createServer(app);

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// =====================
// REST API ROUTES
// =====================
app.use("/health", healthRoute);
app.use("/music", musicRoute);

// root
app.get("/", (req, res) => {
  res.json({
    status: "running",
    mode: "real-time voice streaming",
    ws: "/ws/voice"
  });
});

// =====================
// START WEBSOCKET GATEWAY
// =====================
voiceGateway(server);

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("==================================");
  console.log(" Voice AI Streaming Server Ready ");
  console.log(" Port:", PORT);
  console.log(" Node:", process.version);
  console.log(" WebSocket: /ws/voice");
  console.log("==================================");
});
