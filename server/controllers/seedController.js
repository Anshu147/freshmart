const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');

exports.seedData = async (req, res) => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Collection.deleteMany({});

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'amrita@freshcart.com' });
    if (!adminExists) {
      await User.create({ name: 'Amrita Admin', email: 'amrita@freshcart.com', password: 'amrita@123', role: 'admin' });
    }

    // Seed Categories
    const categories = await Category.insertMany([
      { name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Fresh seasonal fruits' },
      { name: 'Vegetables', slug: 'vegetables', icon: '🥬', description: 'Farm fresh vegetables' },
      { name: 'Dairy & Breakfast', slug: 'dairy', icon: '🥛', description: 'Milk, curd, paneer & more' },
      { name: 'Snacks', slug: 'snacks', icon: '🍿', description: 'Chips, biscuits & munchies' },
      { name: 'Beverages', slug: 'beverages', icon: '🥤', description: 'Juices, tea, coffee & drinks' },
      { name: 'Staples', slug: 'staples', icon: '🌾', description: 'Rice, flour, dal & pulses' },
      { name: 'Personal Care', slug: 'personal-care', icon: '🧴', description: 'Soap, shampoo & essentials' },
      { name: 'Cleaning', slug: 'cleaning', icon: '🧹', description: 'Detergent, disinfectants' },
    ]);

    // Seed Collections
    const collections = await Collection.insertMany([
      { name: 'Best Sellers', slug: 'best-sellers', description: 'Most popular products' },
      { name: 'Trending Deals', slug: 'trending', description: 'Hot deals right now' },
      { name: 'Daily Essentials', slug: 'daily-essentials', description: 'Your everyday needs' },
    ]);

    const [fruits, vegetables, dairy, snacks, beverages, staples] = categories;
    const [bestSeller, trending, dailyEssentials] = collections;

    // Seed Products
    const products = [
      // Fruits
      { name: 'Fresh Apple', slug: 'fresh-apple', description: 'Premium quality red apples, rich in fiber and antioxidants.', images: ['https://images.unsplash.com/photo-1568702846914-96b305d2ebb1?w=400'], category: fruits._id, productCollection: bestSeller._id, variants: [{ name: '500g', price: 80, stock: 50 }, { name: '1kg', price: 150, stock: 30 }], tags: ['apple', 'fruit', 'fresh'], rating: 4.5, numReviews: 128 },
      { name: 'Banana', slug: 'banana', description: 'Fresh yellow bananas, perfect for smoothies and snacks.', images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'], category: fruits._id, productCollection: dailyEssentials._id, variants: [{ name: '1 dozen', price: 40, stock: 100 }, { name: '2 dozen', price: 70, stock: 60 }], tags: ['banana', 'fruit'], rating: 4.3, numReviews: 95 },
      { name: 'Mango Alphonso', slug: 'mango-alphonso', description: 'Premium Alphonso mangoes, the king of fruits.', images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'], category: fruits._id, productCollection: trending._id, variants: [{ name: '500g', price: 120, stock: 25 }, { name: '1kg', price: 220, stock: 15 }], tags: ['mango', 'alphonso', 'fruit'], rating: 4.8, numReviews: 256 },
      { name: 'Orange', slug: 'orange', description: 'Juicy oranges rich in Vitamin C.', images: ['https://images.unsplash.com/photo-1547514701-42782101795e?w=400'], category: fruits._id, productCollection: bestSeller._id, variants: [{ name: '500g', price: 60, stock: 40 }, { name: '1kg', price: 110, stock: 25 }], tags: ['orange', 'fruit', 'citrus'], rating: 4.2, numReviews: 78 },
      // Vegetables
      { name: 'Tomato', slug: 'tomato', description: 'Fresh red tomatoes, perfect for cooking.', images: ['https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'], category: vegetables._id, productCollection: dailyEssentials._id, variants: [{ name: '500g', price: 25, stock: 80 }, { name: '1kg', price: 45, stock: 50 }], tags: ['tomato', 'vegetable'], rating: 4.1, numReviews: 64 },
      { name: 'Onion', slug: 'onion', description: 'Fresh onions for everyday cooking.', images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'], category: vegetables._id, productCollection: dailyEssentials._id, variants: [{ name: '500g', price: 20, stock: 100 }, { name: '1kg', price: 35, stock: 70 }], tags: ['onion', 'vegetable'], rating: 4.0, numReviews: 55 },
      { name: 'Potato', slug: 'potato', description: 'Fresh potatoes, versatile and delicious.', images: ['https://images.unsplash.com/photo-1518977676601-b53f82ber633?w=400'], category: vegetables._id, productCollection: bestSeller._id, variants: [{ name: '500g', price: 20, stock: 90 }, { name: '1kg', price: 35, stock: 60 }], tags: ['potato', 'vegetable', 'aloo'], rating: 4.1, numReviews: 72 },
      { name: 'Green Capsicum', slug: 'green-capsicum', description: 'Fresh green capsicum for salads and cooking.', images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'], category: vegetables._id, productCollection: trending._id, variants: [{ name: '250g', price: 30, stock: 40 }, { name: '500g', price: 55, stock: 20 }], tags: ['capsicum', 'pepper', 'vegetable'], rating: 4.0, numReviews: 42 },
      // Dairy
      { name: 'Amul Milk', slug: 'amul-milk', description: 'Fresh Amul full cream milk.', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'], category: dairy._id, productCollection: dailyEssentials._id, variants: [{ name: '500ml', price: 30, stock: 200 }, { name: '1L', price: 55, stock: 150 }], tags: ['milk', 'amul', 'dairy'], rating: 4.6, numReviews: 320 },
      { name: 'Fresh Paneer', slug: 'fresh-paneer', description: 'Soft and fresh paneer block.', images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'], category: dairy._id, productCollection: bestSeller._id, variants: [{ name: '200g', price: 70, stock: 50 }, { name: '400g', price: 130, stock: 30 }], tags: ['paneer', 'dairy', 'cottage cheese'], rating: 4.4, numReviews: 185 },
      { name: 'Greek Yogurt', slug: 'greek-yogurt', description: 'Creamy Greek yogurt, high in protein.', images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'], category: dairy._id, productCollection: trending._id, variants: [{ name: '200g', price: 45, stock: 60 }, { name: '400g', price: 80, stock: 35 }], tags: ['yogurt', 'curd', 'greek', 'dairy'], rating: 4.3, numReviews: 98 },
      // Snacks
      { name: 'Lays Classic Chips', slug: 'lays-classic', description: 'Crunchy Lays classic salted chips.', images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'], category: snacks._id, productCollection: bestSeller._id, variants: [{ name: '52g', price: 20, stock: 200 }, { name: '130g', price: 50, stock: 100 }], tags: ['lays', 'chips', 'snack'], rating: 4.2, numReviews: 410 },
      { name: 'Maggi Noodles', slug: 'maggi-noodles', description: '2-Minute Masala Noodles - Indias favorite!', images: ['https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400'], category: snacks._id, productCollection: bestSeller._id, variants: [{ name: 'Single Pack', price: 14, stock: 500 }, { name: 'Pack of 4', price: 52, stock: 200 }, { name: 'Pack of 12', price: 144, stock: 80 }], tags: ['maggi', 'noodles', 'snack', 'instant'], rating: 4.7, numReviews: 890 },
      { name: 'Dark Fantasy', slug: 'dark-fantasy', description: 'Rich chocolate filled biscuits.', images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'], category: snacks._id, productCollection: trending._id, variants: [{ name: '75g', price: 30, stock: 100 }, { name: '150g', price: 55, stock: 60 }], tags: ['biscuit', 'cookie', 'chocolate', 'dark fantasy'], rating: 4.5, numReviews: 156 },
      // Beverages
      { name: 'Tropicana Orange Juice', slug: 'tropicana-orange', description: '100% orange juice, no added sugar.', images: ['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400'], category: beverages._id, productCollection: trending._id, variants: [{ name: '200ml', price: 25, stock: 150 }, { name: '1L', price: 99, stock: 60 }], tags: ['juice', 'orange', 'tropicana', 'beverage'], rating: 4.3, numReviews: 134 },
      { name: 'Tata Tea Gold', slug: 'tata-tea-gold', description: 'Premium tea with rich taste and aroma.', images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'], category: beverages._id, productCollection: dailyEssentials._id, variants: [{ name: '250g', price: 130, stock: 80 }, { name: '500g', price: 245, stock: 40 }], tags: ['tea', 'tata', 'beverage', 'chai'], rating: 4.6, numReviews: 267 },
      // Staples
      { name: 'Basmati Rice', slug: 'basmati-rice', description: 'Premium long grain basmati rice.', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], category: staples._id, productCollection: bestSeller._id, variants: [{ name: '1kg', price: 150, stock: 100 }, { name: '5kg', price: 680, stock: 30 }], tags: ['rice', 'basmati', 'staple', 'chawal'], rating: 4.5, numReviews: 198 },
      { name: 'Toor Dal', slug: 'toor-dal', description: 'Premium quality toor/arhar dal.', images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'], category: staples._id, productCollection: dailyEssentials._id, variants: [{ name: '500g', price: 75, stock: 60 }, { name: '1kg', price: 140, stock: 40 }], tags: ['dal', 'toor', 'arhar', 'pulse', 'staple'], rating: 4.4, numReviews: 143 },
      { name: 'Aashirvaad Atta', slug: 'aashirvaad-atta', description: 'Whole wheat flour for soft rotis.', images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'], category: staples._id, productCollection: dailyEssentials._id, variants: [{ name: '1kg', price: 55, stock: 80 }, { name: '5kg', price: 250, stock: 40 }], tags: ['atta', 'flour', 'wheat', 'aashirvaad', 'staple'], rating: 4.5, numReviews: 312 },
      // --- 20 Additional Products ---
      // Personal Care
      { name: 'Dove Soap', slug: 'dove-soap', description: 'Dove cream beauty bar for soft smooth skin.', images: ['https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400'], category: categories[6]._id, productCollection: bestSeller._id, variants: [{ name: '100g', price: 42, stock: 120 }, { name: 'Pack of 3', price: 115, stock: 60 }], tags: ['soap', 'dove', 'personal care', 'skin'], rating: 4.4, numReviews: 210 },
      { name: 'Head & Shoulders Shampoo', slug: 'head-shoulders-shampoo', description: 'Anti-dandruff shampoo for clean healthy hair.', images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400'], category: categories[6]._id, productCollection: trending._id, variants: [{ name: '180ml', price: 120, stock: 80 }, { name: '340ml', price: 210, stock: 45 }], tags: ['shampoo', 'head & shoulders', 'hair', 'personal care'], rating: 4.3, numReviews: 178 },
      { name: 'Colgate Toothpaste', slug: 'colgate-toothpaste', description: 'Colgate strong teeth toothpaste with calcium.', images: ['https://images.unsplash.com/photo-1559591937-2c22c3e3fef9?w=400'], category: categories[6]._id, productCollection: dailyEssentials._id, variants: [{ name: '100g', price: 49, stock: 150 }, { name: '200g', price: 89, stock: 90 }], tags: ['toothpaste', 'colgate', 'dental', 'personal care'], rating: 4.2, numReviews: 190 },
      { name: 'Nivea Body Lotion', slug: 'nivea-body-lotion', description: 'Nivea body lotion for deep moisturizing.', images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400'], category: categories[6]._id, productCollection: trending._id, variants: [{ name: '200ml', price: 165, stock: 70 }, { name: '400ml', price: 295, stock: 35 }], tags: ['lotion', 'nivea', 'moisturizer', 'personal care'], rating: 4.5, numReviews: 142 },
      { name: 'Gillette Razor', slug: 'gillette-razor', description: 'Gillette Mach3 razor for a clean shave.', images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?w=400'], category: categories[6]._id, productCollection: bestSeller._id, variants: [{ name: '1 Razor + 2 Blades', price: 199, stock: 60 }, { name: '4 Blade Refill', price: 350, stock: 40 }], tags: ['razor', 'gillette', 'shaving', 'personal care'], rating: 4.1, numReviews: 88 },
      // Cleaning
      { name: 'Vim Dishwash Liquid', slug: 'vim-dishwash', description: 'Vim dishwash liquid for tough grease removal.', images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400'], category: categories[7]._id, productCollection: dailyEssentials._id, variants: [{ name: '500ml', price: 99, stock: 100 }, { name: '1L', price: 175, stock: 60 }], tags: ['dishwash', 'vim', 'cleaning', 'kitchen'], rating: 4.3, numReviews: 156 },
      { name: 'Surf Excel Detergent', slug: 'surf-excel', description: 'Surf Excel washing powder for tough stains.', images: ['https://images.unsplash.com/photo-1585441695325-21557ef83e9e?w=400'], category: categories[7]._id, productCollection: bestSeller._id, variants: [{ name: '500g', price: 85, stock: 90 }, { name: '1kg', price: 155, stock: 50 }], tags: ['detergent', 'surf excel', 'washing', 'cleaning'], rating: 4.4, numReviews: 265 },
      { name: 'Lizol Floor Cleaner', slug: 'lizol-floor-cleaner', description: 'Lizol disinfectant floor cleaner for germ-free floors.', images: ['https://images.unsplash.com/photo-1585441695325-21557ef83e9e?w=400'], category: categories[7]._id, productCollection: trending._id, variants: [{ name: '500ml', price: 110, stock: 70 }, { name: '1L', price: 199, stock: 40 }], tags: ['floor cleaner', 'lizol', 'disinfectant', 'cleaning'], rating: 4.2, numReviews: 97 },
      { name: 'Harpic Toilet Cleaner', slug: 'harpic-toilet-cleaner', description: 'Harpic disinfectant toilet cleaner.', images: ['https://images.unsplash.com/photo-1585441695325-21557ef83e9e?w=400'], category: categories[7]._id, productCollection: dailyEssentials._id, variants: [{ name: '500ml', price: 89, stock: 80 }, { name: '1L', price: 159, stock: 45 }], tags: ['toilet cleaner', 'harpic', 'bathroom', 'cleaning'], rating: 4.1, numReviews: 130 },
      // More Fruits
      { name: 'Grapes', slug: 'grapes', description: 'Fresh green seedless grapes.', images: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400'], category: fruits._id, productCollection: trending._id, variants: [{ name: '500g', price: 70, stock: 45 }, { name: '1kg', price: 130, stock: 25 }], tags: ['grapes', 'fruit', 'fresh'], rating: 4.2, numReviews: 56 },
      { name: 'Watermelon', slug: 'watermelon', description: 'Sweet refreshing watermelon.', images: ['https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400'], category: fruits._id, productCollection: bestSeller._id, variants: [{ name: '1 piece (~3kg)', price: 80, stock: 30 }, { name: 'Half piece (~1.5kg)', price: 45, stock: 50 }], tags: ['watermelon', 'fruit', 'summer'], rating: 4.0, numReviews: 38 },
      // More Vegetables
      { name: 'Carrot', slug: 'carrot', description: 'Fresh orange carrots, rich in Vitamin A.', images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'], category: vegetables._id, productCollection: dailyEssentials._id, variants: [{ name: '500g', price: 35, stock: 60 }, { name: '1kg', price: 60, stock: 40 }], tags: ['carrot', 'vegetable', 'gajar'], rating: 4.1, numReviews: 47 },
      { name: 'Spinach', slug: 'spinach', description: 'Fresh green spinach leaves, iron-rich.', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'], category: vegetables._id, productCollection: dailyEssentials._id, variants: [{ name: '250g', price: 20, stock: 50 }, { name: '500g', price: 35, stock: 30 }], tags: ['spinach', 'palak', 'vegetable', 'green'], rating: 4.0, numReviews: 33 },
      // More Dairy
      { name: 'Amul Butter', slug: 'amul-butter', description: 'Amul pasteurized butter, rich and creamy.', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'], category: dairy._id, productCollection: bestSeller._id, variants: [{ name: '100g', price: 56, stock: 100 }, { name: '500g', price: 270, stock: 40 }], tags: ['butter', 'amul', 'dairy', 'breakfast'], rating: 4.6, numReviews: 245 },
      { name: 'Amul Cheese Slices', slug: 'amul-cheese-slices', description: 'Amul processed cheese slices for sandwiches.', images: ['https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'], category: dairy._id, productCollection: trending._id, variants: [{ name: '200g (10 slices)', price: 115, stock: 60 }, { name: '400g (20 slices)', price: 215, stock: 30 }], tags: ['cheese', 'amul', 'dairy', 'sandwich'], rating: 4.3, numReviews: 112 },
      // More Snacks
      { name: 'Parle-G Biscuits', slug: 'parle-g-biscuits', description: 'Indias favorite glucose biscuits.', images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'], category: snacks._id, productCollection: bestSeller._id, variants: [{ name: '100g', price: 10, stock: 300 }, { name: '800g', price: 68, stock: 100 }], tags: ['parle-g', 'biscuit', 'glucose', 'snack'], rating: 4.5, numReviews: 520 },
      { name: 'Haldiram Aloo Bhujia', slug: 'haldiram-aloo-bhujia', description: 'Crispy namkeen by Haldirams.', images: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400'], category: snacks._id, productCollection: trending._id, variants: [{ name: '200g', price: 45, stock: 80 }, { name: '400g', price: 82, stock: 50 }], tags: ['bhujia', 'namkeen', 'haldiram', 'snack'], rating: 4.3, numReviews: 145 },
      // More Beverages
      { name: 'Nescafe Classic Coffee', slug: 'nescafe-classic', description: 'Instant coffee for a strong start.', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'], category: beverages._id, productCollection: dailyEssentials._id, variants: [{ name: '25g', price: 55, stock: 100 }, { name: '100g', price: 195, stock: 50 }], tags: ['coffee', 'nescafe', 'instant', 'beverage'], rating: 4.4, numReviews: 189 },
      { name: 'Coca Cola', slug: 'coca-cola', description: 'Refreshing Coca Cola soft drink.', images: ['https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400'], category: beverages._id, productCollection: bestSeller._id, variants: [{ name: '250ml', price: 25, stock: 200 }, { name: '750ml', price: 40, stock: 120 }, { name: '2L', price: 85, stock: 60 }], tags: ['cola', 'coca cola', 'soft drink', 'beverage'], rating: 4.1, numReviews: 310 },
      // More Staples
      { name: 'Tata Salt', slug: 'tata-salt', description: 'Tata iodized salt for everyday cooking.', images: ['https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=400'], category: staples._id, productCollection: dailyEssentials._id, variants: [{ name: '500g', price: 22, stock: 150 }, { name: '1kg', price: 38, stock: 100 }], tags: ['salt', 'tata', 'iodized', 'staple'], rating: 4.2, numReviews: 87 },
    ];

    await Product.insertMany(products);

    res.json({ message: 'Seed data created successfully!', categories: categories.length, collections: collections.length, products: products.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
