const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createItem, getItems, updateItem, deleteItem } = require('../controllers/itemController');

router.post('/', auth, createItem); 
router.get('/', getItems);
router.put('/:id', auth, updateItem); 
router.delete('/:id', auth, deleteItem); 

module.exports = router;
