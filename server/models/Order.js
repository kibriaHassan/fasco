const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    color: String,
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactEmail: { type: String, required: true, lowercase: true },
    items: [orderItemSchema],
    delivery: {
      country: String,
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      postalCode: String,
      saveInfo: Boolean,
    },
    payment: {
      method: { type: String, default: 'Credit Card' },
      cardNumber: String,
      expiration: String,
      securityCode: String,
      cardholderName: String,
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'paid',
      },
    },
    discountCode: { type: String },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
