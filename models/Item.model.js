const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	aspect: {
		type: String,
		required: true,
	},
	swappableWith: {
		type: String,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = model("Item", itemSchema);
