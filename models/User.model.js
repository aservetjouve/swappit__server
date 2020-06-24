const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String, 
      required: true
    }, 
    lastName: {
      type: String, 
      required: true
    },
    location: {
      type: string,
      required: true
    },
    email: {
      type: String, 
      required: true
    }, 
    passwordHash: {
      type: String, 
      required: true 
    }
  }
);

module.exports = model('User', userSchema)