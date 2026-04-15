const mongoose = require('mongoose');

const sharedExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  settled: { type: Boolean, default: false },
  yourShare: { type: Number, required: true },
  participants: [{
    name: String,
    share: Number,
    avatar: String
  }]
}, { timestamps: true });

sharedExpenseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('SharedExpense', sharedExpenseSchema);
