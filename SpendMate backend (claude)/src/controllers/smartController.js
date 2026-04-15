const Expense = require('../models/Expense');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Rule-based suggestion engine ───────────────────────────────────────────

function getRuleBasedSuggestion(expenses) {
  if (!expenses.length) return null;

  const now = new Date();
  const currentHour = now.getHours();

  // Group by category and hour
  const patterns = {};
  expenses.forEach(e => {
    const hour = new Date(e.date).getHours();
    const key = `${e.category}|${Math.floor(hour / 2)}`; // 2-hour buckets
    if (!patterns[key]) patterns[key] = { amounts: [], category: e.category, hours: [] };
    patterns[key].amounts.push(e.amount);
    patterns[key].hours.push(hour);
  });

  // Find pattern closest to current time with enough data
  let bestMatch = null;
  let bestScore = 0;

  Object.values(patterns).forEach(p => {
    if (p.amounts.length < 2) return;

    const avgHour = p.hours.reduce((a, b) => a + b, 0) / p.hours.length;
    const hourDiff = Math.abs(avgHour - currentHour);
    const frequency = p.amounts.length;
    const score = frequency / (1 + hourDiff);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = p;
    }
  });

  if (!bestMatch) {
    // Fallback: most frequent category overall
    const catFreq = {};
    expenses.forEach(e => {
      catFreq[e.category] = catFreq[e.category] || { amounts: [], count: 0 };
      catFreq[e.category].amounts.push(e.amount);
      catFreq[e.category].count++;
    });
    const top = Object.entries(catFreq).sort((a, b) => b[1].count - a[1].count)[0];
    if (!top) return null;
    const avg = top[1].amounts.reduce((a, b) => a + b, 0) / top[1].amounts.length;
    return {
      amount: Math.round(avg),
      category: top[0],
      confidence: Math.min(0.5, top[1].count / 10),
      source: 'rule-based',
    };
  }

  const avg = bestMatch.amounts.reduce((a, b) => a + b, 0) / bestMatch.amounts.length;
  return {
    amount: Math.round(avg),
    category: bestMatch.category,
    confidence: Math.min(0.9, bestMatch.amounts.length / 10),
    source: 'rule-based',
  };
}

// ─── Gemini-powered suggestion ───────────────────────────────────────────────

async function getGeminiSuggestion(expenses) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const summary = expenses.slice(-30).map(e => ({
    amount: e.amount,
    category: e.category,
    hour: new Date(e.date).getHours(),
    description: e.description,
  }));

  const now = new Date();
  const prompt = `
You are a smart expense suggestion engine. Based on the user's recent expense history, suggest what they might spend next.

Current time: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
Day: ${now.toLocaleDateString('en-IN', { weekday: 'long' })}

Recent expenses (last 30):
${JSON.stringify(summary, null, 2)}

Respond with ONLY a JSON object (no markdown, no explanation):
{
  "amount": <number>,
  "category": "<string>",
  "confidence": <0.0-1.0>,
  "reason": "<short reason>"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return { ...JSON.parse(clean), source: 'gemini' };
}

// ─── Controller ──────────────────────────────────────────────────────────────

exports.getSuggestion = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    if (!expenses.length) {
      return res.json({
        amount: 0,
        category: null,
        confidence: 0,
        source: 'none',
        message: 'Not enough data yet. Add some expenses first!'
      });
    }

    // Try Gemini first, fall back to rule-based
    try {
      const suggestion = await getGeminiSuggestion(expenses);
      return res.json(suggestion);
    } catch (geminiErr) {
      console.warn('Gemini failed, using rule-based:', geminiErr.message);
      const suggestion = getRuleBasedSuggestion(expenses);
      return res.json(suggestion || { amount: 0, category: null, confidence: 0, source: 'none' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.categorizeExpense = async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description) return res.status(400).json({ error: 'Description required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const categories = ['Food', 'Travel', 'Entertainment', 'Shopping', 'Health', 'Education', 'Utilities', 'Other'];

    const prompt = `
Categorize this expense into one of these categories: ${categories.join(', ')}

Description: "${description}"
${amount ? `Amount: ₹${amount}` : ''}

Respond ONLY with a JSON object:
{"category": "<category>", "confidence": <0.0-1.0>}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
