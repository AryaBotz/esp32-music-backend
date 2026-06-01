const fs = require("fs");
const { whisper } = require("./groq");

async function transcribe(filePath) {

  const stream =
    fs.createReadStream(filePath);

  const result =
    await whisper(stream);

  return result.text || "";
}

module.exports = {
  transcribe
};
