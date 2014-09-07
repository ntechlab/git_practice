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
		res.view("auth/login", {
			loginInfo: {
				userId :"", 
				userName :"", 
				roleName:"", 
				roleDesc:""
			}
		});
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
				req.session.passport["name"] = user[0]["nickname"];
				req.session.passport["role"] = user[0]["role"];
				return res.redirect('/dashboard');
			});
		})(req, res);
	},

	logout : function(req, res) {
		req.logout();
		if (req.session && req.session.passport) {
			req.session.passport["name"] = "";
			req.session.passport["role"] = "";
		}
		res.redirect('/login');
	},
	_config : {}
};
