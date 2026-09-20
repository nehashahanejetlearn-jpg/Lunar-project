import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily if key is available
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// LUNA AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question, history = [] } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    const ai = getAI();

    // If Gemini key is available, generate response using gemini-3.8-flash
    if (ai) {
      const systemInstruction = `You are LUNA AI, the intelligent lunar science assistant for the "Lunar Explorer" space mission.
Your purpose is to educate students, curious children, and space enthusiasts about the Moon.
Tone: Enthusiastic, friendly, scientifically accurate, engaging, and clear.
Guidelines:
- Explain lunar science concepts simply (like gravity, craters, phases, water ice, resources, missions).
- Use clear formatting with bullet points or bold text where appropriate.
- Keep responses concise (under 150 words) so they are easy to read inside the mission HUD.
- Encourage exploration and curiosity!`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      // Add recent message history if provided
      if (Array.isArray(history)) {
        for (const msg of history.slice(-4)) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(msg.text) }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: question }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Lunar telemetry received. Stand by for scientific verification.';
      res.json({ reply: replyText, source: 'gemini' });
      return;
    }

    // Fallback if no GEMINI_API_KEY is configured
    res.json({
      reply: getFallbackAnswer(question),
      source: 'knowledge-base',
    });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    // Provide an informative fallback response rather than breaking the UI
    res.json({
      reply: getFallbackAnswer(req.body.question || ''),
      source: 'knowledge-base-fallback',
    });
  }
});

function getFallbackAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('made of') || q.includes('composition') || q.includes('rock')) {
    return 'The Moon is rocky and terrestrial! Its crust is mainly made of anorthosite and basalt, rich in oxygen, silicon, magnesium, iron, and calcium. Unlike Earth, it has no liquid water on its surface and only a very tiny iron core.';
  }
  if (q.includes('crater') || q.includes('hole')) {
    return 'The Moon is covered in craters because it has virtually no atmosphere or weather (no wind, rain, or plate tectonics) to erode impact scars! Asteroids and meteorites have smashed into it for over 4 billion years, leaving craters like Tycho and Copernicus perfectly preserved.';
  }
  if (q.includes('live on') || q.includes('colon') || q.includes('base') || q.includes('human')) {
    return 'Humans can live on the Moon inside sealed, pressurized habitats! Astronauts will need radiation shielding (like lunar regolith soil), solar panels or nuclear reactors for energy, and water ice mined from deep polar craters to make drinking water and breathable oxygen.';
  }
  if (q.includes('gravity') || q.includes('weigh') || q.includes('float')) {
    return 'Moon gravity is about 1.62 m/s²—exactly one-sixth (16.6%) of Earth\'s gravity! If you weigh 60 kg (132 lbs) on Earth, you would feel like you weigh just 10 kg (22 lbs) on the Moon. You could leap 6 times higher!';
  }
  if (q.includes('water') || q.includes('ice')) {
    return 'Water ice is hidden inside Permanently Shadowed Regions (PSRs) at the Moon\'s North and South Poles! Deep crater bottoms like Shackleton Crater never see direct sunlight and stay below -240°C, locking ice in frozen soil for billions of years.';
  }
  if (q.includes('phase') || q.includes('cycle')) {
    return 'Moon phases happen because the Moon orbits Earth every 27.3 days. As it circles us, we see different portions of its daylit half illuminated by the Sun—from New Moon (dark), through Crescents and Quarters, to Full Moon!';
  }
  if (q.includes('apollo') || q.includes('artemis') || q.includes('mission')) {
    return 'Apollo 11 landed humans on the Moon on July 20, 1969, with Neil Armstrong and Buzz Aldrin. Today, NASA\'s Artemis program is sending astronauts—including the first woman and person of color—back to establish a permanent Lunar Base Camp!';
  }
  return 'The Moon is Earth\'s only natural satellite, orbiting at an average distance of 384,400 km. It influences our tides and stabilized Earth\'s axial tilt, making complex life possible. Explore our Lunar Map and Labs to see real-time data!';
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lunar Explorer mission server online at http://localhost:${PORT}`);
  });
}

startServer();
