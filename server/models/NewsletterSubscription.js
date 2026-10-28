const mongoose = require('mongoose');

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  'NewsletterSubscription',
  newsletterSubscriptionSchema,
);
