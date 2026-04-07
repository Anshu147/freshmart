const router = require('express').Router();
const { getReviews, addReview } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

router.get('/:productId', getReviews);
router.post('/:productId', auth, addReview);

module.exports = router;
