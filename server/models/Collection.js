const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
