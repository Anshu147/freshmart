const Discount = require('../models/Discount');

exports.createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json(discount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!discount) return res.status(404).json({ message: 'Discount not found' });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discount deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.applyDiscount = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const discount = await Discount.findOne({ code: code.toUpperCase(), active: true });
    if (!discount) return res.status(404).json({ message: 'Invalid discount code' });
    if (discount.expiresAt && discount.expiresAt < new Date()) return res.status(400).json({ message: 'Code expired' });
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) return res.status(400).json({ message: 'Code usage limit reached' });
    if (cartTotal < discount.minOrder) return res.status(400).json({ message: `Minimum order ₹${discount.minOrder}` });

    let amount = discount.type === 'percentage'
      ? (cartTotal * discount.value) / 100
      : discount.value;
    if (discount.maxDiscount) amount = Math.min(amount, discount.maxDiscount);
    amount = Math.min(amount, cartTotal);

    res.json({ amount, code: discount.code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
