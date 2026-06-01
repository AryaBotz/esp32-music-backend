const { whisper } = require("./groq");

async function transcribe(filePath) {
  const result = await whisper(filePath);

  if (!result?.text) {
    throw new Error("STT returned empty text");
  }

  return result.text;
}

module.exports = {
  transcribe,
};
