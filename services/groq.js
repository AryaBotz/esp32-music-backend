const GROQ_API_KEY = process.env.GROQ_API_KEY;

// =====================
// CHAT LLM
// =====================
async function chat(messages) {
  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        temperature: 0.4,
      }),
    }
  );

  return await res.json();
}

module.exports = {
  chat,
};
