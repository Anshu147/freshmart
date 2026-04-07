const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
