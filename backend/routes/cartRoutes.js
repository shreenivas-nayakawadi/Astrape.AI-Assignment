const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.post('/remove', auth, removeFromCart);

module.exports = router;
