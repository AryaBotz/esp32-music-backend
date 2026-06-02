const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

// =====================
// ROUTES
// =====================
app.use("/voice", require("./routes/voice"));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "ESP32 Voice AI Backend",
  });
});

// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  console.log("Node:", process.version);
});
