// orderController.js

const orderModel = require('../models/order');

exports.bookOrder = async (req, res, next) => {
  try {
    // Extract order details from the request body
    const { tripetype, numpeople, totalprice,date} = req.body;

    // Create a new instance of the Order model with the extracted order data
    const orderData = new orderModel({ tripetype, numpeople, totalprice ,date});

    // Save the order data to the database
    await orderData.save();

    // Send a success response back to the client
    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    // If there's an error, send an error response back to the client
    res.status(500).json({ error: err.message });
  }
};
