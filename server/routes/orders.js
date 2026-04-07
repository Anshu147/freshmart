const express = require('express');
const {
  createOrder, verifyPayment, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.get('/my', auth, getMyOrders);
router.get('/admin/all', auth, adminOnly, getAllOrders);
router.patch('/admin/:id', auth, adminOnly, updateOrderStatus);
router.get('/:orderId', auth, getOrder);

module.exports = router;
