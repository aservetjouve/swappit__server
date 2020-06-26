const express = require("express");
const router = express.Router();

const ItemModel = require('../models/Item.model');

/* Check if the user is logged in*/
const { isLoggedIn } = require("../helpers/auth-helper");

router.get("/:ownerId", (req, res) => {
	let owner = req.params.ownerId
	console.log(owner)
	ItemModel.find({owner: owner})
		.then((item) => {
			console.log(item)
			res.status(200).json(item)
		})
		.catch((err) => {
			res.status(500).json({
				error: "Something went wrong",
				message: err,
			});
		});
});

router.post("/add", isLoggedIn, (req, res) => {
    const { name, type, aspect, swappableWith} = req.body;
    console.log(req.session.currentUser)
    const owner = req.session.currentUser._id
	ItemModel.create({
		name: name,
        type: type,
        aspect: aspect, 
        swappableWith: swappableWith,
        owner: owner
	})
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({
				error: "Something went wrong",
				message: err,
			});
		});
});

router.get("/search/:id", (req, res) => {
	ItemModel.findById(req.params.id)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({
				error: "Something went wrong",
				message: err,
			});
		});
});

router.delete("/:id", isLoggedIn, (req, res) => {
	ItemModel.findByIdAndDelete(req.params.id)
		.then((response) => {
            // res.status(200).json(response);
            res.send('DELETED')
		})
		.catch((err) => {
			res.status(500).json({
				error: "Something went wrong",
				message: err,
			});
		});
});



router.patch("/:id", isLoggedIn, (req, res) => {
	let id = req.params.id;
	const { name, type, aspect, swappableWith } = req.body;
	ItemModel.findByIdAndUpdate(id, {
		$set: {
			name: name,
			type: type,
			aspect: aspect,
			swappableWith: aspect,
		},
	})
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: "Something went wrong",
				message: err,
			});
		});
});

module.exports = router;