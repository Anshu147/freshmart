const Product = require('../models/Product');

exports.chatSearch = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const msg = message.toLowerCase().trim();

    // Greeting patterns
    if (/^(hi|hello|hey|hii|helo)/.test(msg)) {
      return res.json({
        message: 'Hello! 👋 I\'m FreshCart Assistant. Tell me what product you\'re looking for! Example: "I want maggie", "show me fruits"',
        productId: null,
      });
    }

    // Help pattern
    if (/help|how|what can/.test(msg)) {
      return res.json({
        message: 'I can help you find products! Just type the product name like "maggie", "milk", "rice", "chips" etc. and I\'ll find it for you!',
        productId: null,
      });
    }

    // Extract product name - remove common words
    const stopWords = ['i', 'want', 'need', 'show', 'me', 'find', 'get', 'buy', 'please', 'the', 'a', 'an', 'some', 'can', 'you', 'do', 'have', 'is', 'there', 'looking', 'for', 'search'];
    const keywords = msg.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 1);

    if (keywords.length === 0) {
      return res.json({
        message: 'Could you please specify a product name? Example: "maggie", "milk", "bread"',
        productId: null,
      });
    }

    // Search in MongoDB
    const searchQuery = keywords.join(' ');
    const products = await Product.find(
      { $text: { $search: searchQuery }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(3)
      .populate('category', 'name');

    // Fallback: regex search if no text match
    let results = products;
    if (results.length === 0) {
      const regex = new RegExp(keywords.join('|'), 'i');
      results = await Product.find({
        $or: [{ name: regex }, { tags: { $in: [regex] } }],
        isActive: true,
      }).limit(3).populate('category', 'name');
    }

    if (results.length === 0) {
      return res.json({
        message: `Sorry, I couldn't find any products matching "${searchQuery}". Try searching for something else!`,
        productId: null,
      });
    }

    const topProduct = results[0];
    const priceRange = topProduct.variants.length > 0
      ? `₹${Math.min(...topProduct.variants.map(v => v.price))} - ₹${Math.max(...topProduct.variants.map(v => v.price))}`
      : 'Check product page';

    let response = `Found "${topProduct.name}" ${topProduct.category?.name ? `(${topProduct.category.name})` : ''} — ${priceRange}`;

    if (results.length > 1) {
      response += `\n\nAlso found: ${results.slice(1).map(p => p.name).join(', ')}`;
    }

    response += '\n\nClick below to view the product! 👇';

    res.json({
      message: response,
      productId: topProduct._id,
      productName: topProduct.name,
      suggestions: results.slice(1).map(p => ({ id: p._id, name: p.name })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
