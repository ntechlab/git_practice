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
	var loginInfo = Utility.getLoginInfo(req, res);
	User.find({}).sort('username').exec(function(err, usersFound) {
            res.view({users: usersFound, 
            loginInfo: loginInfo
		});
	});
    },

    openCreate : function(req, res) {
	console.log("openCreate called");
	var loginInfo = Utility.getLoginInfo(req, res);
	User.find({}).exec(function(err, usersFound) {
		res.view({users: usersFound,  
			loginInfo: loginInfo
		});
	});
    },

    createUser : function(req, res) {
	console.log("createUser called");
	var loginInfo = Utility.getLoginInfo(req, res);
	User.create({
	    username: req.param('username'),
	    password: req.param('password'),
	    nickname: req.param('nickname'),
	    role: req.param('role'),
	    flag1: req.param('valid')
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
	var loginInfo = Utility.getLoginInfo(req, res);
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
    // ユーザー一覧で指定されたID
	var target = req.param('target');
	console.log("User info changed:"+target);
	var loginInfo = Utility.getLoginInfo(req, res);
	User.findOne(target).exec(function(err, oldUser) {
	    var newData = {};
	    var newUsername = req.param('username');
	    var newPassword = req.param('password');
	    var newNickname = req.param('nickname');
	    var role = req.param('role');
	    var valid = req.param('valid');
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
	    
	    if(role != null) {
	    	newData["role"] = role;
	    }
	    if(valid != null) {
	    	newData["flag1"] = valid;
	    }
	    console.dir(newData);
	    User.update({id:target}, newData).exec(function(err, found) {
		console.log("err:"+err);
		console.log("found["+found +"]");
		User.find({}).exec(function(err, usersFound) {
			if(loginInfo["roleName"] === 'admin') {
				res.redirect('/usermanage/index');
			} else {
				res.redirect('/dashboard/index');
			}
		});
	    });
	});
    },

    openUpdateUser : function(req, res) {
	console.log("openUpdateUser called");
	var loginInfo = Utility.getLoginInfo(req, res);
	var id = req.param("target");
	if(!id){
		id = loginInfo["userId"];
	}
	User.findOne(id).exec(function(err, found){
				res.view({username: found["username"],
				nickname: found["nickname"],
				target: id,
				loginInfo: loginInfo,
				valid: found["flag1"],
				role: found["role"]
			});
	});
    },
};

