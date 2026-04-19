// ── FD Saathi — API Server (Gemini) ──
import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServer } from 'http';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── FD Rates (server-side, easy to update without redeploying frontend) ──
const FD_RATES = [
  {
    id: 'suryoday-1',
    bank: 'Suryoday Small Finance Bank',
    bankShort: 'Suryoday SFB',
    tenure: '12 months',
    tenureMonths: 12,
    rate: 9.10,
    minAmount: 5000,
    seniorRate: 9.60,
    type: 'Small Finance Bank',
    safetyRating: 'AA-',
    insured: true,
    highlight: true,
  },
  {
    id: 'esaf-1',
    bank: 'ESAF Small Finance Bank',
    bankShort: 'ESAF SFB',
    tenure: '24 months',
    tenureMonths: 24,
    rate: 8.75,
    minAmount: 1000,
    seniorRate: 9.25,
    type: 'Small Finance Bank',
    safetyRating: 'AA-',
    insured: true,
    highlight: false,
  },
  {
    id: 'ujjivan-1',
    bank: 'Ujjivan Small Finance Bank',
    bankShort: 'Ujjivan SFB',
    tenure: '18 months',
    tenureMonths: 18,
    rate: 8.50,
    minAmount: 1000,
    seniorRate: 9.00,
    type: 'Small Finance Bank',
    safetyRating: 'AA',
    insured: true,
    highlight: false,
  },
  {
    id: 'jana-1',
    bank: 'Jana Small Finance Bank',
    bankShort: 'Jana SFB',
    tenure: '36 months',
    tenureMonths: 36,
    rate: 8.25,
    minAmount: 5000,
    seniorRate: 8.75,
    type: 'Small Finance Bank',
    safetyRating: 'BBB+',
    insured: true,
    highlight: false,
  },
  {
    id: 'utkarsh-1',
    bank: 'Utkarsh Small Finance Bank',
    bankShort: 'Utkarsh SFB',
    tenure: '12 months',
    tenureMonths: 12,
    rate: 8.50,
    minAmount: 1000,
    seniorRate: 9.00,
    type: 'Small Finance Bank',
    safetyRating: 'A+',
    insured: true,
    highlight: false,
  },
  {
    id: 'shriram-1',
    bank: 'Shriram Finance',
    bankShort: 'Shriram Fin.',
    tenure: '24 months',
    tenureMonths: 24,
    rate: 8.18,
    minAmount: 5000,
    seniorRate: 8.68,
    type: 'NBFC',
    safetyRating: 'AAA',
    insured: false,
    highlight: false,
  },
  {
    id: 'mahindra-1',
    bank: 'Mahindra Finance',
    bankShort: 'Mahindra Fin.',
    tenure: '36 months',
    tenureMonths: 36,
    rate: 8.05,
    minAmount: 10000,
    seniorRate: 8.55,
    type: 'NBFC',
    safetyRating: 'AAA',
    insured: false,
    highlight: false,
  },
  {
    id: 'sbi-1',
    bank: 'State Bank of India',
    bankShort: 'SBI',
    tenure: '12 months',
    tenureMonths: 12,
    rate: 6.80,
    minAmount: 1000,
    seniorRate: 7.30,
    type: 'PSU Bank',
    safetyRating: 'AAA',
    insured: true,
    highlight: false,
  },
];

let ratesUpdatedAt = new Date().toISOString();

// ── GET /api/rates — serve FD rates to frontend ──
app.get('/api/rates', (req, res) => {
  res.json({ rates: FD_RATES, updatedAt: ratesUpdatedAt });
});

// ── POST /api/chat — AI advisor ──
app.post('/api/chat', async (req, res) => {
  const { messages, systemPrompt, language } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ content: getFallbackResponse(language) });
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Gemini history must start with 'user' — drop leading assistant messages
    const allPrior = messages.slice(0, -1);
    const firstUserIdx = allPrior.findIndex(m => m.role === 'user');
    const prior = firstUserIdx === -1 ? [] : allPrior.slice(firstUserIdx);

    const history = prior.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const chat = model.startChat({ history });
    const lastMsg = messages[messages.length - 1];

    if (!lastMsg?.content) {
      return res.json({ content: getFallbackResponse(language) });
    }

    const result = await chat.sendMessage(lastMsg.content);
    const content = result.response.text();
    res.json({ content: content?.trim() ? content : getFallbackResponse(language) });
  } catch (err) {
    console.error('Gemini error:', err.message, err.status || '');
    res.json({ content: getFallbackResponse(language) });
  }
});

function getFallbackResponse(language) {
  const responses = {
    hi: `आपके सवाल के लिए धन्यवाद!

**Suryoday Small Finance Bank** अभी सबसे अच्छी दर दे रहा है:
• 12 महीने के लिए **9.10% प्रति वर्ष**
• ₹1 लाख → 1 साल बाद ₹1,09,100
• DICGC बीमित (₹5 लाख तक सुरक्षित)

क्या आप कोई विशेष राशि या अवधि के बारे में जानना चाहते हैं?`,
    mr: `तुमच्या प्रश्नाबद्दल धन्यवाद!

**Suryoday Small Finance Bank** आता सर्वोत्तम दर देत आहे:
• 12 महिन्यांसाठी **9.10% प्रति वर्ष**
• DICGC विमाकृत — ₹5 लाखांपर्यंत सुरक्षित

तुम्ही किती गुंतवणूक करणार?`,
    en: `Thanks for asking!

**Suryoday Small Finance Bank** currently offers the best rate:
• **9.10% per year** for 12 months
• ₹1 lakh grows to ₹1,09,100 in 1 year
• DICGC insured (govt guaranteed up to ₹5 lakh)

How much are you planning to invest?`,
  };
  return responses[language] || responses.en;
}

const PORT = process.env.PORT || 3001;
createServer(app).listen(PORT, () => {
  console.log(`\n🚀 FD Saathi API running at http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Not set (fallback mode)'}`);
  console.log(`   Model: ${process.env.GEMINI_MODEL || 'gemini-2.5-flash (default)'}\n`);
});
