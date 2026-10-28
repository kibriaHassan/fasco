const NewsletterSubscription = require('../models/NewsletterSubscription');

exports.subscribe = async (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }

  try {
    await NewsletterSubscription.create({ email });
    res.status(201).json({ message: 'Thanks for subscribing!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This email is already subscribed' });
    }
    next(error);
  }
};
