const express = require('express');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getCategories, createCategory, getCollections, createCollection, getProductsByCollection,
} = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/collections', getCollections);
router.get('/collection/:slug', getProductsByCollection);
router.get('/:id', getProduct);

router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);
router.post('/categories', auth, adminOnly, createCategory);
router.post('/collections', auth, adminOnly, createCollection);

module.exports = router;
