/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require("passport");

module.exports = {
	login : function(req, res) {
		console.log("login action");
		res.view("auth/login");
	},

	process : function(req, res) {
		console.log("process action");
		passport.authenticate('local', function(err, user, info) {
			if ((err) || (!user)) {
				res.redirect('/login');
				return;
			}
			req.logIn(user, function(err) {
				if (err) {
					res.redirect('/login');
				}
				console.log("login ok ");
				return res.redirect('/dashboard');
			});
		})(req, res);
	},

	logout : function(req, res) {
		req.logout();
		res.send('logout successful');
	},
	_config : {}
};
