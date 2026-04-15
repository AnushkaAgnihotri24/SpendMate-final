const Group = require('../models/Group');
const GroupExpense = require('../models/GroupExpense');

exports.createGroup = async (req, res) => {
  try {
    const { name, members = [] } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name required' });

    // Always include creator
    const memberSet = [...new Set([req.userId, ...members])];
    const group = await Group.create({ name, members: memberSet, createdBy: req.userId });
    await group.populate('members', 'name email');
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.userId);
    if (!isMember) return res.status(403).json({ error: 'Not a group member' });

    const { amount, description, category, splitBetween } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });

    const split = splitBetween?.length ? splitBetween : group.members;

    const expense = await GroupExpense.create({
      groupId: group._id,
      paidBy: req.userId,
      amount,
      description,
      category: category || 'Other',
      splitBetween: split,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isMember = group.members.some(m => m._id.toString() === req.userId);
    if (!isMember) return res.status(403).json({ error: 'Not a group member' });

    const expenses = await GroupExpense.find({ groupId: group._id })
      .populate('paidBy', 'name email')
      .populate('splitBetween', 'name email')
      .sort({ date: -1 });

    // Compute balances dynamically
    const balances = computeBalances(expenses, group.members);

    res.json({ group, expenses, balances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userId }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compute who owes whom
function computeBalances(expenses, members) {
  const net = {}; // userId -> net amount (positive = owed money, negative = owes money)

  members.forEach(m => { net[m._id.toString()] = 0; });

  expenses.forEach(exp => {
    const payer = exp.paidBy._id.toString();
    const share = exp.amount / exp.splitBetween.length;

    exp.splitBetween.forEach(member => {
      const uid = member._id.toString();
      if (uid !== payer) {
        net[payer] += share;
        net[uid] -= share;
      }
    });
  });

  // Build readable settlements
  const settlements = [];
  const debtors = Object.entries(net).filter(([, v]) => v < -0.01).map(([id, v]) => ({ id, amount: -v }));
  const creditors = Object.entries(net).filter(([, v]) => v > 0.01).map(([id, v]) => ({ id, amount: v }));

  debtors.forEach(debtor => {
    const member = members.find(m => m._id.toString() === debtor.id);
    creditors.forEach(creditor => {
      if (debtor.amount > 0.01 && creditor.amount > 0.01) {
        const paid = Math.min(debtor.amount, creditor.amount);
        const creditorMember = members.find(m => m._id.toString() === creditor.id);
        settlements.push({
          from: { id: debtor.id, name: member?.name },
          to: { id: creditor.id, name: creditorMember?.name },
          amount: Math.round(paid * 100) / 100
        });
        debtor.amount -= paid;
        creditor.amount -= paid;
      }
    });
  });

  return { net, settlements };
}
