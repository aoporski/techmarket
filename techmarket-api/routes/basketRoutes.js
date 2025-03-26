const express = require('express');
const router = express.Router();
const {addToBasket, getBasket, updateQuantity, removeFromBasket} = require('../controllers/basketController');
router.post('/', addToBasket);
router.get('/:user_id', getBasket);
router.put('/:user_id/:product_id', updateQuantity);
router.delete('/:user_id/:product_id', removeFromBasket);

module.exports = router;