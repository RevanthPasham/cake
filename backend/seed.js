require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Cake = require('./models/Cake');

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error('Missing MONGO_URL in .env. Aborting seed.');
  process.exit(1);
}

mongoose.connect(mongoUrl)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });

async function seed() {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Cake.deleteMany({});

    await Category.insertMany([
      { name: 'Chocolate', image: 'https://images.unsplash.com/photo-1559628233.jpg' },
      { name: 'Wedding', image: 'https://images.unsplash.com/photo-1543007143.jpg' },
      { name: 'Birthday', image: 'https://images.unsplash.com/photo-1587242900751.jpg' }
    ]);

    await Cake.insertMany([
      {
        name: 'Dark Chocolate Cake',
        prices: [400],
        cutPrices: [0],
        discounts: [],
        images: ['https://images.unsplash.com/photo-1600.jpg'],
        categories: ['Chocolate'],
        flavour: 'Dark Chocolate',
        weightOptions: ['500g'],
        shortDescription: 'Rich dark chocolate cake',
        longDescription: 'A moist dark chocolate cake topped with ganache.',
        tags: ['chocolate'],
        veg: true
      },
      {
        name: 'Wedding White Cake',
        prices: [1200],
        cutPrices: [0],
        discounts: [],
        images: ['https://images.unsplash.com/photo-1200.jpg'],
        categories: ['Wedding'],
        flavour: 'Vanilla',
        weightOptions: ['1kg'],
        shortDescription: 'Elegant wedding cake',
        longDescription: 'Classic multi-tiered white wedding cake.',
        tags: ['wedding'],
        veg: true
      },
      {
        name: 'Kids Birthday Cake',
        prices: [600],
        cutPrices: [0],
        discounts: [],
        images: ['https://images.unsplash.com/photo-1300.jpg'],
        categories: ['Birthday'],
        flavour: 'Vanilla',
        weightOptions: ['500g'],
        shortDescription: "Fun kids' birthday cake",
        longDescription: 'Colorful cake perfect for kids birthday parties.',
        tags: ['kids','birthday'],
        veg: true
      }
    ]);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
