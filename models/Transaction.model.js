const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
	itemUserA: {
		type: Schema.Types.ObjectId,
		ref: "Item",
	},
	itemUserB: {
		type: Schema.Types.ObjectId,
		ref: "Item",
	},
	itMatches: Boolean,
});

module.exports = model("Transaction", transactionSchema);
