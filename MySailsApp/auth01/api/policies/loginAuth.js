
module.exports = function(req, res, next) {
	console.log("loginAuth: 認証状態["+req.isAuthenticated() + "]");
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect("/");
	}
};
