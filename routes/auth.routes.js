const express = require("express");
const router = express.Router();

/* Hash the password */
const bcrypt = require("bcryptjs");

const UserModel = require("../models/User.model");

/* Check if the user is logged in*/
const { isLoggedIn } = require("../helpers/auth-helper");

router.post("/signup", (req, res) => {
	const { firstName, lastName, location, email, password } = req.body;
	if (!firstName || !lastName || !location || !email || !password) {
		res.status(500).json({
			errorMessage: "Please fill-in all the entry",
		});
		return;
	}

	const myRegex = new RegExp(
		/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
	);
	if (!myRegex.test(email)) {
		res.status(500).json({
			errorMessage: "Email format not correct",
		});
		return;
	}

	const myPassRegex = new RegExp(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
	);
	if (!myPassRegex.test(password)) {
		res.status(500).json({
			errorMessage:
				"Password needs to have 8 characters, a number and an Uppercase alphabet",
		});
		return;
	}

	bcrypt.genSalt(12).then((salt) => {
		bcrypt.hash(password, salt).then((passwordHash) => {
			UserModel.create({
				firstName,
				lastName,
				email,
				location,
				email,
				passwordHash,
			})
				.then((user) => {
					user.passwordHash = "***";
					req.session.currentUser = user
					
					res.status(200).json(user);
				})
				.catch((err) => {
					if (err.code === 11000) {
						res.status(500).json({
							errorMessage:
								"username or email entered already exists!",
						});
						return;
					} else {
						res.status(500).json({
							errorMessage: "Something went wrong!",
						});
						return;
					}
				});
		});
	});
});

router.post("/signin", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(500).json({
			error: "Please enter email and password",
		});
		return;
	}
	const myRegex = new RegExp(
		/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
	);
	if (!myRegex.test(email)) {
		res.status(500).json({
			error: "Email format not correct",
		});
		return;
	}

	// Find if the user exists in the database
	UserModel.findOne({ email })
		.then((userData) => {
			//check if passwords match
			bcrypt
				.compare(password, userData.passwordHash)
				.then((doesItMatch) => {
					//if it matches
					if (doesItMatch) {
						// req.session is the special object that is available to you
						userData.passwordHash = "***";
						req.session.currentUser = userData;
						res.status(200).json(userData);
					}
					//if passwords do not match
					else {
						res.status(500).json({
							error: "Passwords don't match",
						});
						return;
					}
				})
				.catch(() => {
					res.status(500).json({
						error: "Email format not correct",
					});
					return;
				});
		})
		//throw an error if the user does not exists
		.catch((err) => {
			res.status(500).json({
				error: "Email format not correct",
				message: err,
			});
			return;
		});
});

router.post("/logout", (req, res) => {
	req.session.destroy();
	res.status(204).send();
});

router.get("/user", isLoggedIn, (req, res, next) => {
	res.status(200).json(req.session.currentUser);
});

router.get("/otheruser/:id", (req, res) => {
	UserModel.findById(req.params.id)
		.then((response) => {res.status(200).json(response);})
})

module.exports = router;
