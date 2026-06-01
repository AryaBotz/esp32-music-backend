const express = require("express");
const cors = require("cors");

const chatRoute = require("./routes/chat");
const musicRoute = require("./routes/music");
const sttRoute = require("./routes/stt");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);
app.use("/music", musicRoute);
app.use("/stt", sttRoute);

app.get("/", (req, res) => {
  res.json({ status: "ESP32 AI backend running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
