const express = require("express");
const cors = require("cors");

const chatRoute = require("./routes/chat");
const musicRoute = require("./routes/music");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/chat", chatRoute);
app.use("/music", musicRoute);

// health check
app.get("/", (req, res) => {
  res.json({
    status: "backend running clean architecture"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
