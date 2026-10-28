require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = require('../../client/src/data/demoProducts.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { slug: product.slug },
          update: { $set: product },
          upsert: true,
        },
      })),
    );
    console.log(`Seeded ${products.length} products with local images`);

    const adminEmail = 'admin@fasco.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        firstName: 'FASCO',
        lastName: 'Admin',
        email: adminEmail,
        phone: '+10000000000',
        password: 'Admin@123',
      });
      console.log('Created admin user: admin@fasco.com / Admin@123');
    } else {
      console.log('Admin user already exists, skipped');
    }

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
