const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ['MEN', 'WOMEN', 'ACCESSORIES', 'KIDS', 'FOOTWEAR'],
    },
    tags: [{ type: String }],
    sizes: [{ type: String }],
    colors: [colorSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    dealOfMonth: { type: Boolean, default: false },
    peappyBlinders: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, slug: 1 });
productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);
