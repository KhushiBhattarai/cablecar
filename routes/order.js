// order.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route for booking an order
router.post("/book", orderController.bookOrder);

module.exports = router;
