function detectMood(text) {

  text = text.toLowerCase();

  if (text.includes("sedih")) return "sad";
  if (text.includes("capek") || text.includes("stress")) return "focus";
  if (text.includes("semangat") || text.includes("happy")) return "happy";
  if (text.includes("tidur")) return "sleep";

  return "neutral";
}

module.exports = { detectMood };
