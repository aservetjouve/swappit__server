const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String, 
      required: [true, 'Please enter your first name']
    }, 
    lastName: {
      type: String, 
      required: [true, 'Please enter your last name']
    },
    location: {
      type: String,
      required: [true, 'Please enter your location']
    },
    email: {
      type: String, 
      required: [true, 'Please enter your email']
    }, 
    passwordHash: {
      type: String, 
      required: [true, 'Please enter a password'] 
    }
  }
);
userSchema.index({ 'email': 1}, {unique: true});
module.exports = model('User', userSchema)