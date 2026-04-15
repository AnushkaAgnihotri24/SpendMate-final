const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['owe', 'owedToMe'], required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'settled'], default: 'pending' }
}, { timestamps: true });

ledgerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Ledger', ledgerSchema);
