const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  variant: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // e.g. ORD-XXXX
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  paymentMethod: { type: String, enum: ['cod', 'upi'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveredAt: { type: Date },
}, { timestamps: true });

orderSchema.pre('save', function () {
  if (!this.orderId) {
    this.orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
});

module.exports = mongoose.model('Order', orderSchema);
