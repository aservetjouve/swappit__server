const express = require("express");
const router = express.Router();

const TransactionModel = require('../models/Transaction.model');
const ItemModel = require('../models/Item.model')

/* Check if the user is logged in*/
const { isLoggedIn } = require("../helpers/auth-helper");

router.post("/:id", isLoggedIn, (req, res) => {
	let userA = req.session.currentUser._id;
	let itemUserA = "";
	let userB = "";
	let itemUserB = req.params.id;
	ItemModel.find({ owner: userA }).then((result) => {
		itemUserA = result[0]._id;
		ItemModel.find({ _id: itemUserB }).then((result) => {
			userB = result[0].owner;
			TransactionModel.find({
				userA: userA,
				userB: userB,
				itemUserA: itemUserA,
				itemUserB: itemUserB,
			})
				.then((result) => {
					if (!result.length){
                        TransactionModel.find({
                            userA: userB,
                            userB: userA,
                            itemUserA: itemUserB,
                            itemUserB: itemUserA,
                        })
                            .then((result) => {
                                if (!result.length){
                                    TransactionModel.create({
                                        userA: userA,
                                        itemUserA: itemUserA,
                                        userB: userB,
                                        itemUserB: itemUserB,
                                        oneUserAgreed: true,
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
                                } else {
                                    res.send("It's a match")
                                }
                                }) 
                                
                    } else {
                        res.send('Already created')
                    }
				})					
		});
	});
});

module.exports = router;