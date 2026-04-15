const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  billingCycle: { type: String, default: 'monthly' },
  renewalDate: { type: Date, required: true },
  icon: { type: String, default: '📦' },
  dailyContribution: { type: Number, default: 0 }
}, { timestamps: true });

subscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
