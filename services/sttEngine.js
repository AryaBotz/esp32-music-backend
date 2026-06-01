const { whisper } = require("./groq");

async function transcribe(filePath) {

  const result =
    await whisper(filePath);

  return result.text || "";
}

module.exports = {
  transcribe
};
