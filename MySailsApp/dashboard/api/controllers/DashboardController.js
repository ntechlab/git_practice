/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	    sails.log.debug("action: DashboardController.index");
		var loginInfo = Utility.getLoginInfo(req, res);
		Board.find({}).exec(function(err,found){
			if(err){
				sails.log.error("メイン画面オープン時にエラー発生[" + JSON.stringify(err) +"]");
				found = [];
				// TODO: エラーをユーザーに通知する方法を検討する。
			}
			res.view({
				list: found,
				loginInfo: loginInfo
			});
		});
    },
    
    openBoard2 : function(req, res) {
	var boardId = req.param("selectedId");
    sails.log.debug("action: DashboardController.openBoard2["+boardId+"]");
	if(!boardId){
	    sails.log.debug("ボードIDが存在しないためボード選択画面に遷移。");
	    res.redirect("/dashboard/index");
	    return;
	}
	var loginInfo = Utility.getLoginInfo(req, res);

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
		if(err){
			sails.log.error("エラー発生: " + JSON.stringify(err));
		    res.redirect("/dashboard/index");
		}
		if(!found) {
			sails.log.error("指定されたボードIDが存在しないため、ボード選択画面に遷移[" + boardId + "]");
		    res.redirect("/dashboard/index");
		    return;
	    }
	    Ticket.find({boardId : boardId}).exec(function(err2, tickets) {

		// 第1段階で終了すべき関数
		var prerequisite = [];

		// 対象ボード上のチケットにニックネームを追加する。
		for(var i = 0; i < tickets.length; i++) {

		    // インデックス番号を保持するためのクロージャー
		    new function(num){
			var ti = tickets[num];

			// 各チケットに対するニックネーム取得処理のラッパ関数をprerequisiteに格納
			// TODO: チケットごとにユーザー検索を行っており効率が悪い。改良予定。
			prerequisite.push(function(next) {
				var createUser = ti["createUser"];
			    User.findOne(createUser).exec(function(err3, userFound) {
				if(err3){
					sails.log.error("チケットのユーザーIDの検索: エラー発生: " + createUser + "," + JSON.stringify(err3));
				} else {
					if(userFound){
					    // ニックネームをチケットに追加。
					    ti["nickname"] = userFound["nickname"];
					} else {
						sails.log.warn("チケットのユーザーIDの検索: 結果なし[" + createUser + "]");
					}
				}
				// コールバック関数終了時にnext()を呼び出す。
				next();
			    });
			})
		    }(i);
		};
		var boardList;
		prerequisite.push(function(next) {
		    Board.find().where({ id: { 'not': boardId }}).exec(function(err4, boards) {
				if(err4) {
					sails.log.error("ボードリストの取得: エラー発生: " + JSON.stringify(err4));
					boardList = [];
				} else {
					boardList = boards || [];
				}
				
			// コールバック関数終了時にnext()を呼び出す。
			next();
		    });
		})
			

		// ビュー生成関数のラッパー生成
		var createViewWrapper = function (){
		    var obj = {
				boardId: boardId, 
				loginInfo: loginInfo,
				title : found["title"], 
				description: found["description"],
				ticketData : tickets,
				boardList : boardList,
				list : tickets
			}; 
			res.view(obj);
		};

		// 同期処理実行
		wait(prerequisite, createViewWrapper);
	    });
    	});
    },

    editBoard : function(req, res) {
		var id = req.param("selectedId");
	    sails.log.debug("action: DashboardController.editBoard["+id+"]");
		var loginInfo = Utility.getLoginInfo(req, res);
		Board.findOne(id).exec(function(err,found){
		    if(err || !found) {
				sails.log.error("ボード編集時 ボード取得失敗: エラー発生:[" + found + "]:" + JSON.stringify(err));
				res.redirect('/dashboard/index');
				return;
			} else {
				sails.log.debug("編集対象ボード[" + JSON.stringify(found) + "]");
	    	    res.view({ id: id, 
			       title :found["title"], 
			       description:found["description"],
			       loginInfo: loginInfo
				});
			}
    	});
    },

    deleteBoard : function(req, res) {
		var id = req.param("selectedId");
		sails.log.debug("action: DashboardController.deleteBoard["+id+"]");
		// 削除対象ボードIDが設定されていない場合には、処理を行わずメイン画面に遷移。
		if(id != null){
			Board.destroy(id).exec(function(err, found){
				sails.log.debug("ボード削除 削除対象[" + JSON.stringify(found) + "]");
				if(err) {
					sails.log.error("ボード削除時: エラー発生:" + JSON.stringify(err));
				} else {
					sails.log.info("ボード削除：正常終了[" + id + "]");
				}
			});
		} else {
			sails.log.info("ボード削除：ボードID未設定");	
		}
    	res.redirect('/dashboard/index');
    },
    
    createBoard : function(req, res) {
		sails.log.debug("action: DashboardController.createBoard");
    	res.redirect('/newboard/index');
    }

};

