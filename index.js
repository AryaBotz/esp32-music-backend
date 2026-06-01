const express = require("express");
const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json({ limit: "10mb" }));

// =====================
// ROUTES
// =====================
app.use("/stt", require("./routes/stt"));
app.use("/ai", require("./routes/ai"));
app.use("/music", require("./routes/music")); // 🔥 INI YANG KAMU LUPA

// =====================
// HEALTH CHECK
// =====================
app.get("/", (req, res) => {
  res.send("AI Music Backend Running");
});

// =====================
// ERROR HANDLER (BIAR TIDAK BLANK 400)
// =====================
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: "Invalid JSON"
    });
  }
  next();
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
