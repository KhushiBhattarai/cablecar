const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/cablecar");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  address: {
    type: String
  
  },
  phonenumber: {
    type: String
  },
  nationality:{
    type: String
  }
});

userSchema.plugin(plm);

// define the model or the collection name

const User = mongoose.model('User', userSchema); 
module.exports =User;