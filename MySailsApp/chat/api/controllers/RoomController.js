/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	talkingspot : function(req, res) {
		console.log("talkingspotアクションが呼ばれた。");

		// モデルをわたしてビューを開く。
		res.view({
			id : req.param('id')
		});
	},

	checkin : function(req, res) {
		console.log("checkinアクションが呼ばれた:"+ req.param('userID'));

		// リクエストに格納されているsocketを購読者として登録。？？？
		User.watch(req.socket);

		// すべての購読者に対してメッセージを発行する。
		User.publishCreate({
			id : req.param('userID'),
			param: 'ダミー'
		});
	}
};
