const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "500g", "1kg"
  price: { type: Number, required: true },   // selling/discounted price
  mrp: { type: Number },                     // original MRP (real price)
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, default: '' },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  productCollection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  variants: [variantSchema],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
