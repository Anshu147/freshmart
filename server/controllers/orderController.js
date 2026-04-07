const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Calculate totals
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal >= 300 ? 0 : 85;
    const totalAmount = subtotal + shipping;

    const isCOD = paymentMethod === 'cod';

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      subtotal,
      shipping,
      totalAmount,
      paymentMethod: isCOD ? 'cod' : 'upi',
      paymentStatus: isCOD ? 'pending' : 'paid',
      orderStatus: 'confirmed',
    });

    // WhatsApp notification URL
    const phone = order.shippingAddress.phone;
    const msg = encodeURIComponent(
      `Order Confirmed ✅\nOrder ID: ${order.orderId}\nTotal: ₹${order.totalAmount}\nPayment: ${isCOD ? 'Cash on Delivery' : 'Paid via UPI'}\nThank you for shopping with FreshCart!`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${msg}`;

    res.json({
      orderId: order.orderId,
      amount: totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      whatsappUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: 'paid', orderStatus: 'confirmed' },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const phone = order.shippingAddress.phone;
    const msg = encodeURIComponent(
      `Order Confirmed ✅\nOrder ID: ${order.orderId}\nTotal: ₹${order.totalAmount}\nThank you for shopping with FreshCart!`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${msg}`;

    res.json({ success: true, order, whatsappUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, ...(orderStatus === 'delivered' && { deliveredAt: new Date() }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
