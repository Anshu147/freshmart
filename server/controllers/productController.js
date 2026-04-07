const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, collection, sort, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (collection) filter.productCollection = collection;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { 'variants.price': 1 };
    if (sort === 'price_desc') sortOption = { 'variants.price': -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(filter)
      .populate('category', 'name slug icon')
      .populate('productCollection', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('productCollection');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const col = await Collection.create(req.body);
    res.status(201).json(col);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ active: true });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    const products = await Product.find({ productCollection: collection._id, isActive: true }).populate('category');
    res.json({ collection, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
