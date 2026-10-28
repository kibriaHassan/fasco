const User = require('../models/User');
const Product = require('../models/Product');

async function getUserWithCart(userId) {
  return User.findById(userId).populate({
    path: 'cart.product',
    model: 'Product',
  });
}

exports.getCart = async (req, res, next) => {
  try {
    const user = await getUserWithCart(req.user._id);
    res.json({ cart: user?.cart || [] });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId || !size || !color) {
      return res
        .status(400)
        .json({ message: 'productId, size, and color are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: 'Invalid size for this product' });
    }

    const colorMatch = product.colors.some(
      (c) => c.name.toLowerCase() === String(color).toLowerCase()
    );
    if (!colorMatch) {
      return res.status(400).json({ message: 'Invalid color for this product' });
    }

    const user = await User.findById(req.user._id);
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const existing = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color.toLowerCase() === String(color).toLowerCase()
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      user.cart.push({
        product: productId,
        quantity: qty,
        size,
        color,
      });
    }

    await user.save();
    const populated = await getUserWithCart(user._id);

    res.status(201).json({ message: 'Added to cart', cart: populated.cart });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.id(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.quantity = quantity;
    await user.save();

    const populated = await getUserWithCart(user._id);
    res.json({ message: 'Cart updated', cart: populated.cart });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    const item = user.cart.id(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.deleteOne();
    await user.save();

    const populated = await getUserWithCart(user._id);
    res.json({ message: 'Item removed', cart: populated.cart });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared', cart: [] });
  } catch (err) {
    next(err);
  }
};
