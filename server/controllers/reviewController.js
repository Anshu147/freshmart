const Review = require('../models/Review');
const Product = require('../models/Product');

// GET /api/reviews/:productId
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reviews/:productId
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5' });

    const existing = await Review.findOne({ product: req.params.productId, user: req.user.id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user.id,
      rating,
      comment,
    });

    // Update product rating
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].count,
      });
    }

    res.status(201).json(await review.populate('user', 'name'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
