const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    userA: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    userB: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    itemUserA: {
      type: Schema.Types.ObjectId,
      ref: 'Item'
    },
    itemUserB: {
      type: Schema.Types.ObjectId,
      ref: 'Item'
    },
    oneUserAgreed: Boolean,
  }
);

module.exports = model('Transaction', transactionSchema)