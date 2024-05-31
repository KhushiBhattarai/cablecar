var express = require('express');
const ejs = require('ejs');
var router = express.Router();
const userModel = require("../models/users");
const postModel = require("../models/posts");
const orderModel = require("../models/order");
const priceModel = require("../models/price");
const passport = require('passport');
const multer = require('multer');
const localStrategy = require("passport-local");
const User = require('../models/users');
passport.use(new localStrategy(userModel.authenticate()));




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('startpage');
});

router.get('/admin', function(req, res, next) {
  res.render('admin');
});


router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error')});
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{error: req.flash('error')});
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  res.render('profile', {user});
});

router.get('/home', isLoggedIn, function(req, res, next) {
  res.render('homepage');
});

router.get('/about', isLoggedIn, function(req, res, next) {
  res.render('about');
});



router.get('/gallery', isLoggedIn, function(req, res, next) {
  res.render('gallery');
});

router.get('/contact', isLoggedIn, function(req, res, next) {
  res.render('contact');
});

// Route for rendering the book order form
router.get('/book', isLoggedIn, function(req, res) {
  res.render('book');
});

// Route for booking an order
router.post("/book", async function(req, res) {
  try {
    // Extract order details from the request body
    const { triptype, numpeople, totalprice,tripdate } = req.body;

    // Create a new instance of the Order model with the extracted order data
    const orderData = new orderModel({ triptype, numpeople, totalprice , tripdate});
  
    // Save the order data to the database
    await orderData.save();

    // Send a success response back to the client
    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    // If there's an error, send an error response back to the client
    res.status(404).json({ error: err.message });
  }
});

 
// payment
const Payment = require("../models/paymentModel");
const PurchasedItem = require("../models/purchaseitemmodel");
const Order = require("../models/order");

//payment esewa
// Route for rendering the book order form
router.get('/esewa', async (req, res) => {
  try {
      // Retrieve the latest order from the database
      const latestOrder = await Order.findOne().sort({ _id: -1 }).limit(1);

      if (!latestOrder) {
          return res.status(404).json({ error: "No orders found" });
      }
      
      // Render the 'esewa' view with the latest order data
      res.render('esewa', { order: latestOrder });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
router.get('/test', function(req, res) {
  // Get Transaction ID from req
  // Run Fetch Statment
  // Extract Signature
  // Open the new tab link consisting of PayNow Option
  // The existing page will look for change in Transaction Status (Locally)
  // On Change - Bill Gets Generated.
  res.render('test');
});

const { getEsewaPaymentHash, verifyEsewaPayment } = require("../esewa");
router.post("/initialize-esewa", async (req, res) => {
  try {
    const { orderId, totalprice } = req.body;
    // Validate item exists and the price matches
    const itemData = await Order.findOne({
      _id: orderId,
      totalprice: Number(totalprice),
    });

    if (!itemData) {
      return res.status(400).send({
        success: false,
        message: "Item not found or price mismatch.",
      });
    }

    // Create a record for the purchase
    const purchasedItemData = await PurchasedItem.create({
      order: orderId,
      paymentMethod: "esewa",
      totalprice: Number(totalprice),
      status: "pending"
    });

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalprice,
      transaction_uuid: purchasedItemData._id,
    });

    // Respond with payment details
    res.json({
    success: true,
     payment: paymentInitiate,
   purchasedItemData,
    });
    // Get payment details from the request body
   
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}); 


// Route for completing payment
router.get("/complete-payment", async (req, res) => {
  const { data } = req.query; // Data received from eSewa's redirect

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the purchased item using the transaction UUID
    const purchasedItemData = await PurchasedItem.findById(paymentInfo.response.transaction_uuid);

    if (!purchasedItemData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    
});






router.get('/esewaForm', function(req, res) {
  console.log(req.body)
  // Get Transaction ID from req
  // Run Fetch Statment
  // Extract Signature
  // Open the new tab link consisting of PayNow Option
  // The existing page will look for change in Transaction Status (Locally)
  // On Change - Bill Gets Generated.
  res.render('esewaForm');
});

router.post("/signup", function(req,res){
  const { username, email, fullname,address, phonenumber, nationality } = req.body;
  const userData = new userModel({ username, email,fullname, address,phonenumber,nationality });
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local") (req,res,function(){
      res.redirect("/login");
    })
  })
})

router.post("/login", passport.authenticate("local",{
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}), function(req,res){
});

router.get("/logout", function(req,res){
  req.logout(function(err){
    if(err){ return next(err);}
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}


module.exports = router;


