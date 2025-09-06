const Item = require("../models/Item");

// Create new item
exports.createItem = async (req, res) => {
      const item = new Item(req.body);
      await item.save();
      res.json(item);
};

// Get items with optional filters
exports.getItems = async (req, res) => {
      const { category, minPrice, maxPrice } = req.query;
      let filter = {};
      if (category) filter.category = category;
      if (minPrice || maxPrice)
            filter.price = {
                  ...(minPrice && { $gte: Number(minPrice) }),
                  ...(maxPrice && { $lte: Number(maxPrice) }),
            };
      const items = await Item.find(filter);
      res.json(items);
};

// Update item
exports.updateItem = async (req, res) => {
      const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
      });
      res.json(item);
};

// Delete item
exports.deleteItem = async (req, res) => {
      await Item.findByIdAndDelete(req.params.id);
      res.json({ msg: "Item deleted" });
};
