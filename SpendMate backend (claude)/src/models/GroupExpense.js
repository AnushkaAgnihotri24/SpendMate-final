const mongoose = require('mongoose');

const groupExpenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: 'Other' },
  splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('GroupExpense', groupExpenseSchema);
