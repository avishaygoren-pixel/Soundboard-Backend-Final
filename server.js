const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();

// Force CORS to allow EVERYTHING for now to stop blocks
app.use(cors({ origin: '*' }));
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// A simple test to see if the server is alive
app.get('/test', (req, res) => res.json({ status: "Backend is awake!" }));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message sent" });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error("LOG:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server live on ${PORT}`));
