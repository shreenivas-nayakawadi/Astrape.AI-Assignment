const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
      const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.item"
      );
      res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
      let cart = await Cart.findOne({ user: req.user._id });
      const { item, quantity } = req.body;
      if (!cart) cart = new Cart({ user: req.user._id, items: [] });
      const idx = cart.items.findIndex((i) => i.item.toString() === item);
      if (idx > -1) cart.items[idx].quantity += quantity;
      else cart.items.push({ item, quantity });
      await cart.save();
      res.json(cart);
};

exports.removeFromCart = async (req, res) => {
      let cart = await Cart.findOne({ user: req.user._id });
      cart.items = cart.items.filter(
            (i) => i.item.toString() !== req.body.item
      );
      await cart.save();
      res.json(cart);
};
