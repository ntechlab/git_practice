/**
 * BoardController
 * 
 * Sailsでは、ORM(Object-Relation Mapping)としてWaterlineを利用している。
 * @description :: Server-side logic for managing boards
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `BoardController.index()`
	 */
	index : function(req, res) {
		console.log("★チケットリストの取得");
		Ticket.find().exec(function(err, user) {
			var ret = "";
			for (var i = 0; i < user.length; i++) {
				ret += user[i].contents;
				ret += "<br>";
			}
			var param = {
				list : user
			};
			res.view(param);
		});
	},

	ticketCreate : function(req, res) {

		var actionType = req.param('actionType');
		var id = req.param('targetId');

		console.log("ticketCreate:contents:" + actionType);

		if (actionType == "create") {
			console.log("★チケットの作成");
			Ticket.create({
				contents : req.param('memo')
			}).exec(function(err, user) {
				if (err) {
					return console.log(err);
				} else {
					console.log("User created:", user);
					res.redirect("board/index");
				}
			});
		} else if (actionType == "delete") {
			console.log("★チケットの削除:" + id);
			Ticket.find({
				id : id
			}).exec(function(err, user) {
				console.dir(user);
				user[0].destroy();
				res.redirect("board/index");
			});
		} else if (actionType == "modify") {
			console.log("★チケットの修正:" + id + ", " + req.param('modText'));
			Ticket.update({
				id : id
			}, {
				contents : req.param('modText')
			}).exec(function afterwards(err, updated) {

				if (err) {
					return console.log(err);
				}
				res.redirect("board/index");
			});
		}

	},
};
