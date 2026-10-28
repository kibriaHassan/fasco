const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const DISCOUNT_CODES = {
  FASCO10: 0.1,
  WELCOME15: 0.15,
};

exports.createOrder = async (req, res, next) => {
  try {
    const { contactEmail, delivery, payment, discountCode } = req.body;

    if (!contactEmail || !delivery || !payment) {
      return res
        .status(400)
        .json({ message: 'contactEmail, delivery, and payment are required' });
    }

    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = [];
    let subtotal = 0;

    for (const line of user.cart) {
      const product = line.product;
      if (!product) continue;

      if (product.stock < line.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      const lineTotal = product.price * line.quantity;
      subtotal += lineTotal;

      items.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: line.quantity,
        size: line.size,
        color: line.color,
        image: product.images[0],
      });
    }

    if (!items.length) {
      return res.status(400).json({ message: 'No valid cart items' });
    }

    let discount = 0;
    if (discountCode && DISCOUNT_CODES[discountCode.toUpperCase()]) {
      discount = subtotal * DISCOUNT_CODES[discountCode.toUpperCase()];
    }

    const shipping = subtotal - discount > 100 ? 0 : 12;
    const total = Math.max(0, subtotal - discount + shipping);

    // Never store full card secrets in production — demo only, strip CVV
    const safePayment = {
      method: payment.method || 'Credit Card',
      cardNumber: payment.cardNumber
        ? `****${String(payment.cardNumber).slice(-4)}`
        : undefined,
      expiration: payment.expiration,
      cardholderName: payment.cardholderName,
      status: 'paid',
    };

    const order = await Order.create({
      user: user._id,
      contactEmail,
      items,
      delivery,
      payment: safePayment,
      discountCode: discountCode || undefined,
      subtotal,
      discount,
      shipping,
      total,
    });

    for (const line of user.cart) {
      if (line.product) {
        await Product.findByIdAndUpdate(line.product._id, {
          $inc: { stock: -line.quantity },
        });
      }
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title slug images');
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product', 'title slug images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
