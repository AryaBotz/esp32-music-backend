const express = require("express");
const cors = require("cors");

const chatRoute = require("./routes/chat");
const musicRoute = require("./routes/music");
const sttRoute = require("./routes/stt");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/chat", chatRoute);
app.use("/music", musicRoute);
app.use("/stt", sttRoute);

// health check
app.get("/", (req, res) => {
  res.json({
    status: "ESP32 AI backend running",
    routes: ["/chat", "/music", "/stt"]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
