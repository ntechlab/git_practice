/**
 * UserManageController
 *
 * @description :: Server-side logic for managing Usermanages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var crypto = require('crypto');

module.exports = {

    index : function(req, res) {
        sails.log.debug("action: UserManageController.index");
		var loginInfo = Utility.getLoginInfo(req, res);
		User.find({}).sort('username').exec(function(err, usersFound) {
			if(err){
				sails.log.error("ユーザー管理画面オープン時にエラー発生:" + JSON.stringify(err));
				res.redirect("/dashboard/index");
				return;
			}
			if(usersFound == null) {
				sails.log.warn("ユーザー管理画面オープン時のユーザーリストがnull");
				// TODO: どのように処理するか？
				usersFound = [];
			}
            res.view({users: usersFound, 
            loginInfo: loginInfo
		});
	});
    },

    openCreate : function(req, res) {
        sails.log.debug("action: UserManageController.openCreate");
		var loginInfo = Utility.getLoginInfo(req, res);
		User.find({}).exec(function(err, usersFound) {
			if(err){
				sails.log.error("エラー発生:" + JSON.stringify(err));
				// TODO: 暫定的にトップ画面に遷移。どのように処理するか？
				res.redirect("/dashboard/index");
				return;
			}
			res.view({users: usersFound,  
			loginInfo: loginInfo
		});
	});
    },

    createUser : function(req, res) {
        sails.log.debug("action: UserManageController.createUser");
		var loginInfo = Utility.getLoginInfo(req, res);
		User.create({
		    username: req.param('username'),
		    password: req.param('password'),
		    nickname: req.param('nickname'),
		    role: req.param('role'),
		    flag1: req.param('valid')
		}).exec(function(err, obj) {
			sails.log.info("ユーザー作成[" + JSON.stringify(obj) + "]");
			if(err){
				sails.log.error("エラー発生:" + JSON.stringify(err));
				// TODO: 暫定的にトップ画面に遷移。どのように処理するか？
				res.redirect("/dashboard/index");
				return;
			}
			res.redirect('/usermanage/index');
		});
    },

    destroyUser : function(req, res) {
		var target = req.param('target');
		sails.log.debug("action: UserManageController.destroyUser[" + target+ "]");
		if(target){
			var loginInfo = Utility.getLoginInfo(req, res);
			User.destroy(target).exec(function(err, obj) {
				// sails.log.info("ユーザー削除結果[" + JSON.stringify(obj) + "]");
				if(err){
					sails.log.error("ユーザーの削除処理に失敗[" + JSON.stringify(err) + "]");
				}
				res.redirect('/usermanage/index');
			});
		} else {
			sails.log.debug("削除ユーザーIDが未設定のため処理を行わない。");
			res.redirect('/usermanage/index');
		}
    },

    updateUser : function(req, res) {
	    // ユーザー一覧で指定されたID
		var target = req.param('target');
        sails.log.debug("action: UserManageController.updateUser["+target+"]");
		var loginInfo = Utility.getLoginInfo(req, res);
		// ユーザーIDが未設定の場合には、一覧に遷移。
		if(!target){
			sails.log.warn("ユーザー管理更新アクション ユーザーID未設定");
			res.redirect('/usermanage/index');
			return;
		}
		User.findOne(target).exec(function(err, oldUser) {
			// sails.log.info("更新ユーザー検索結果[" + JSON.stringify(oldUser) + "]");
			if(err){
				sails.log.error("ユーザー更新処理に失敗[" + JSON.stringify(err) + "]");
				res.redirect('/usermanage/index');
				return;
			}
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
		    sails.log.debug("更新ユーザー情報[" + JSON.stringify(newData));
		    User.update({id:target}, newData).exec(function(err, obj) {
				// sails.log.debug("ユーザー更新結果[" + JSON.stringify(obj) +"]");
				if(err) {
					sails.log.error("ユーザー情報更新時にエラー発生:" + JSON.stringify(err));
				}
				var role = loginInfo["roleName"];
				var next;
				if(role === 'admin') {
					next = '/usermanage/index';
				} else {
					next = '/dashboard/index';
				}
				sails.log.debug("ユーザ情報更新後の次画面決定処理:[" + role + "] -> "+next);
				res.redirect(next);
		    });
		});
    },

    openUpdateUser : function(req, res) {
		var id = req.param("target");
		sails.log.debug("action: UserManageController.openUpdateUser[" + id + "]");
		var loginInfo = Utility.getLoginInfo(req, res);
		// 更新対象ユーザーIDが空の場合は、ログインユーザーIDを設定。
		if(!id){
			id = loginInfo["userId"];
		}
		User.findOne(id).exec(function(err, found){
			// sails.log.debug("ユーザー情報取得結果:" + JSON.stringify(found));
			if(err || !found) {
				sails.log.error("ユーザー情報更新画面オープン失敗:" + JSON.stringify(err));
				res.redirect('/dashboard/index');
				return;
			}
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

