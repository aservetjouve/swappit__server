const isLoggedIn = (req, res, next) => {
	if (req.session.currentUser) next();
	else {
		res.status(401).json({
			message: "Unauthorized user",
			code: 401,
		});
	}
};

module.exports = {
	isLoggedIn
};