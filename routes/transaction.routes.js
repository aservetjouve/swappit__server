const express = require("express");
const router = express.Router();

const TransactionModel = require("../models/Transaction.model");
const ItemModel = require("../models/Item.model");
const UserModel = require('../models/User.model')

/* Check if the user is logged in*/
const { isLoggedIn } = require("../helpers/auth-helper");

router.get("/done/:id", (req, res) => {
	let user = req.params.id;
	console.log(user);
	ItemModel.find({
		owner: user,
	}).then((result) => {
		let { _id } = result[0];
		console.log("object is ", _id);
		TransactionModel.find({
			$or: [
				{ itemUserA: _id },
				{ itemUserB: _id },
			],
			itMatches: true,
		}).then((result) => {
			console.log("transaction is ", result);

			res.status(200).json(result);
		});
	});
});

router.get('/init/:userId', (req, res) => {
	let activeUser = req.params.userId;
	console.log('Active user is', activeUser)
	ItemModel.find({
		owner: activeUser
	}).then((result) => {
		let {_id} = result[0]

	UserModel.find({
		_id: activeUser
	}).then((result) => {
		let {location} = result[0]
		console.log('Location is ', location)
		
		UserModel.find({
			location: location,
			_id: { $ne: activeUser }
		}).then((result)=> {
			let searchResult = [];
			for (i=0; i<result.length; i++){
				ItemModel.find({
					owner: result[i]._id
				}).then((result) => {
					let objectToMatch = result
					TransactionModel.find({
						$or: [
							{ 
								itemUserA: _id,
								itemUserB: result[0]._id
							},
							{ 
								itemUserA:result[0]._id,
								itemUserB: _id,
							},
						]
					}).then((result)=> {
						if (!result.length){
							searchResult.push(objectToMatch)
						}
					})
					
				})
			}
			setTimeout(()=>{
				res.status(200).json(searchResult);
				console.log(searchResult)
			},1000)
		})
	})
})
})

router.post("/:myItem/:otherItem", (req, res) => {
	let itemUserA = req.params.myItem;
	let itemUserB = req.params.otherItem;
	TransactionModel.find({
		itemUserA: itemUserA,
		itemUserB: itemUserB,
	}).then((result) => {
		/*CHECK IF TRANSACTION ALREADY EXISTS*/
		if (!result.length) {
			TransactionModel.find({
				itemUserA: itemUserB,
				itemUserB: itemUserA,
			}).then((result) => {
				/*CHECK IF OTHER USER ALREADY AGREED*/
				if (!result.length) {
					TransactionModel.create({
						itemUserA: itemUserA,
						itemUserB: itemUserB,
						itMatches: false,
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
					/*WHEN BOTH USER AGREED*/
					TransactionModel.findOneAndUpdate(
						{ _id: result[0]._id },
						{ itMatches: true }
					).then((response) => {
						res.status(200).json(response);
					});
				}
			});
		}
	});
});



module.exports = router;
