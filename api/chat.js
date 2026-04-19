import { GoogleGenerativeAI } from '@google/generative-ai';
import { FD_RATES } from './_data.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, systemPrompt, language } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ content: getFallbackResponse(language) });
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemPrompt });

    const allPrior = messages.slice(0, -1);
    const firstUserIdx = allPrior.findIndex(m => m.role === 'user');
    const prior = firstUserIdx === -1 ? [] : allPrior.slice(firstUserIdx);
    const history = prior.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const chat = model.startChat({ history });
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg?.content) return res.json({ content: getFallbackResponse(language) });

    const result = await chat.sendMessage(lastMsg.content);
    const content = result.response.text();
    res.json({ content: content?.trim() ? content : getFallbackResponse(language) });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.json({ content: getFallbackResponse(language) });
  }
}

function getFallbackResponse(language) {
  const responses = {
    hi: `आपके सवाल के लिए धन्यवाद!\n\n**Suryoday Small Finance Bank** अभी सबसे अच्छी दर दे रहा है:\n• 12 महीने के लिए **9.10% प्रति वर्ष**\n• ₹1 लाख → 1 साल बाद ₹1,09,100\n• DICGC बीमित (₹5 लाख तक सुरक्षित)\n\nक्या आप कोई विशेष राशि के बारे में जानना चाहते हैं?`,
    mr: `तुमच्या प्रश्नाबद्दल धन्यवाद!\n\n**Suryoday SFB** — 9.10% प्रति वर्ष (12 महिने)\nDICGC विमाकृत — ₹5 लाखांपर्यंत सुरक्षित\n\nतुम्ही किती गुंतवणूक करणार?`,
    en: `Thanks for asking!\n\n**Suryoday Small Finance Bank** currently offers the best rate:\n• **9.10% per year** for 12 months\n• ₹1 lakh grows to ₹1,09,100 in 1 year\n• DICGC insured (govt guaranteed up to ₹5 lakh)\n\nHow much are you planning to invest?`,
  };
  return responses[language] || responses.en;
}
