
module.exports = function(req, res, next) {
	console.log("loginAuth: status["+req.isAuthenticated() + "]");
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect("/login");
	}
};
