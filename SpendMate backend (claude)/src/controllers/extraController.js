const Goal = require('../models/Goal');
const Subscription = require('../models/Subscription');
const Ledger = require('../models/Ledger');
const SharedExpense = require('../models/SharedExpense');

// --- GOALS ---
exports.getGoals = async (req, res) => {
  try {
    const items = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addGoal = async (req, res) => {
  try {
    const item = await Goal.create({ ...req.body, userId: req.userId });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- SUBSCRIPTIONS ---
exports.getSubscriptions = async (req, res) => {
  try {
    const items = await Subscription.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addSubscription = async (req, res) => {
  try {
    const item = await Subscription.create({ ...req.body, userId: req.userId });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- LEDGER ---
exports.getLedger = async (req, res) => {
  try {
    const items = await Ledger.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addLedger = async (req, res) => {
  try {
    const item = await Ledger.create({ ...req.body, userId: req.userId });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.settleLedger = async (req, res) => {
  try {
    const item = await Ledger.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: 'settled' },
      { new: true }
    );
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- SHARED EXPENSES ---
exports.getSharedExpenses = async (req, res) => {
  try {
    const items = await SharedExpense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addSharedExpense = async (req, res) => {
  try {
    const item = await SharedExpense.create({ ...req.body, userId: req.userId });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.settleSharedExpense = async (req, res) => {
  try {
    const item = await SharedExpense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { settled: true },
      { new: true }
    );
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
