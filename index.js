const express = require("express");
const app = express();

app.use(express.json({ limit: "10mb" }));

app.use("/stt", require("./routes/stt"));
app.use("/ai", require("./routes/ai"));

app.get("/", (req, res) => {
  res.send("AI Music Backend Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
