const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use("/stt", require("./routes/stt"));
app.use("/ai", require("./routes/ai"));
app.use("/music", require("./routes/music"));
app.use("/voice", require("./routes/voice"));

app.get("/", (req, res) => {
  res.send("AI Music Backend Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
