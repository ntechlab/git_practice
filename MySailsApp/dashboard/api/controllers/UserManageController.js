/**
 * UserManageController
 *
 * @description :: Server-side logic for managing Usermanages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var crypto = require('crypto');

module.exports = {

    index : function(req, res) {
	console.log("open UserManage");
	var loginUserId = Utility.getLoginUserId(req, res);
	User.find({}).exec(function(err, usersFound) {
            res.view({users: usersFound, loginUserId: loginUserId});
	});
    },

    openCreate : function(req, res) {
	console.log("openCreate called");
	var loginUserId = Utility.getLoginUserId(req, res);
	User.find({}).exec(function(err, usersFound) {
            res.view({users: usersFound, loginUserId: loginUserId});
	});
    },

    createUser : function(req, res) {
	console.log("createUser called");
	var loginUserId = Utility.getLoginUserId(req, res);
	User.create({
	    username: req.param('username'),
	    password: req.param('password'),
	    nickname: req.param('nickname')
	}).exec(function(err, tickets) {
	    User.find({}).exec(function(err, usersFound) {
		res.redirect('/usermanage/index');
	    });
	});
    },

    destroyUser : function(req, res) {
	console.log("destroyUser called");
	var target = req.param('target');
	if(target){
	var loginUserId = Utility.getLoginUserId(req, res);
	User.destroy(target).exec(function(err, found) {
	    User.find({}).exec(function(err, usersFound) {
		res.redirect('/usermanage/index');
	    });
	});
	} else {
	  console.log("destroy userid not given");
		res.redirect('/usermanage/index');
	}
    },

    updateUser : function(req, res) {
	var target = req.param('target');
	console.log("User info changed:"+target);
	var loginUserId = Utility.getLoginUserId(req, res);
	User.findOne(target).exec(function(err, oldUser) {
	    var newData = {};
	    var newUsername = req.param('username');
	    var newPassword = req.param('password');
	    var newNickname = req.param('nickname');
	    if(oldUser["username"] !== newUsername){
		newData["username"] = newUsername;
	    }
	    if(newPassword !== ""){
		var shasum = crypto.createHash('sha1');
		shasum.update(newPassword);
		var hashed = shasum.digest('hex');
		newData["password"] = hashed;
	    }

	    if(oldUser["nickname"] !== newNickname){
		newData["nickname"] = newNickname;
	    }
	    console.dir(newData);
	    User.update({id:target}, newData).exec(function(err, found) {
		console.log("err:"+err);
		console.log("found["+found +"]");
		User.find({}).exec(function(err, usersFound) {
		    res.redirect('/usermanage/index');
		});
	    });
	});
    },

    openUpdateUser : function(req, res) {
	console.log("openUpdateUser called");
	var loginUserId = Utility.getLoginUserId(req, res);
	var id = req.param("target");
	User.findOne(id).exec(function(err, found){
	    res.view({username: found["username"],
		      nickname: found["nickname"],
		      target: id,
		      loginUserId: loginUserId});
	});
    },
};

