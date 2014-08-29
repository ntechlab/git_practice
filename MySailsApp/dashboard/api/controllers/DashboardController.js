/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	var loginUserId = Utility.getLoginUserId(req, res);
	Board.find({}).exec(function(err,found){
            res.view({list: found, loginUserId: loginUserId});
	});
    },

    openBoard : function(req, res) {
	var boardId = req.param("selectedId");
	var loginUserId = Utility.getLoginUserId(req, res);
	console.log("selected boardId:"+boardId);

	var wait = function (callbacks, done) {
		var counter = callbacks.length;
		if(counter > 0){
			var next = function() {
				if (--counter == 0) {
					done();
				}
			};
			for (var i=0; i < callbacks.length; i++) {
				callbacks[i](next);
			};
		} else {
			done();
		}
	}

	Board.findOne(boardId).exec(function(err,found){
	    console.log("edit board:found["+found+"]");
	    Ticket.find({boardId : boardId}).exec(function(err, tickets) {

		// 第1段階で終了すべき関数
		var prerequisite = [];

		// 対象ボード上のチケットにニックネームを追加する。
		for(var i = 0; i < tickets.length; i++) {

		    // インデックス番号を保持するためのクロージャー
		    new function(num){
			var ti = tickets[num];

			// 各チケットに対するニックネーム取得処理のラッパ関数をprerequisiteに格納
			prerequisite.push(function(next) {
			    User.findOne(ti["createUser"]).exec(function(err, userFound) {
				console.log("prerequisite function No."+num+" called.");
				if(userFound){
				    // ニックネームをチケットに追加。
				    ti["nickname"] = userFound["nickname"];
				}

				// コールバック関数終了時にnext()を呼び出す。
				next();
			    });
			})
		    }(i);
		    console.log("ループ[" + i + "] 終了");
		};

		// ビュー生成関数のラッパー生成
		var createViewWrapper = function (){
		    console.log("createViewWrapper called");
		    var obj = {boardId: boardId, 
		 	      loginUserId: loginUserId,
		 	      title : found["title"], 
		 	      description: found["description"],
		 	      list : tickets}; 
		    console.dir(obj);
    		    res.view(obj);
		};

		// 同期処理実行
		wait(prerequisite, createViewWrapper);
	    });
    	});
    },

    openBoard2 : function(req, res) {
	var boardId = req.param("selectedId");
	console.log("openBoard2 called: boardId[" + boardId + "]");
	if(!boardId){
	    console.log("ボードIDが存在しないためボード選択画面に遷移。");
	    res.redirect("/dashboard/index");
	    return;
	}
	var loginUserId = Utility.getLoginUserId(req, res);
	console.log("selected boardId:"+boardId);

	var wait = function (callbacks, done) {
		var counter = callbacks.length;
		if(counter > 0){
			var next = function() {
				if (--counter == 0) {
					done();
				}
			};
			for (var i=0; i < callbacks.length; i++) {
				callbacks[i](next);
			};
		} else {
			done();
		}
	}

	Board.findOne(boardId).exec(function(err,found){
	    console.log("edit board:found["+found+"]");
	    Ticket.find({boardId : boardId}).exec(function(err, tickets) {

		// 第1段階で終了すべき関数
		var prerequisite = [];

		// 対象ボード上のチケットにニックネームを追加する。
		for(var i = 0; i < tickets.length; i++) {

		    // インデックス番号を保持するためのクロージャー
		    new function(num){
			var ti = tickets[num];

			// 各チケットに対するニックネーム取得処理のラッパ関数をprerequisiteに格納
			prerequisite.push(function(next) {
			    User.findOne(ti["createUser"]).exec(function(err, userFound) {
				console.log("prerequisite function No."+num+" called.");
				if(userFound){
				    // ニックネームをチケットに追加。
				    ti["nickname"] = userFound["nickname"];
				}

				// コールバック関数終了時にnext()を呼び出す。
				next();
			    });
			})
		    }(i);
		    console.log("ループ[" + i + "] 終了");
		};

		// ビュー生成関数のラッパー生成
		var createViewWrapper = function (){
		    console.log("createViewWrapper called");
		    var obj = {boardId: boardId, 
		 	      loginUserId: loginUserId,
		 	      title : found["title"], 
		 	      description: found["description"],
			      ticketData : tickets,
		 	      list : tickets}; 
		    console.dir(obj);
    		    res.view(obj);
		};

		// 同期処理実行
		wait(prerequisite, createViewWrapper);
	    });
    	});
    },

    editBoard : function(req, res) {
	var id = req.param("selectedId");
	var loginUserId = Utility.getLoginUserId(req, res);
	console.log("selected id:"+id);
	Board.findOne(id).exec(function(err,found){
	    console.log("edit board:found["+found+"]");
	    console.dir(found);
    	    res.view({ id: id, 
		       title :found["title"], 
		       description:found["description"],
		       loginUserId: loginUserId});
    	});
    },

    deleteBoard : function(req, res) {
	var id = req.param("selectedId");
	console.log("selected id:"+id);
	Board.destroy(id).exec(function(err,found){
            console.log("Destory board : "+id);
	});
    	res.redirect('/dashboard/index');
    },
    
    createBoard : function(req, res) {
    	res.redirect('/newboard/index');
    }

};

