/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	say : function(req, res) {
		Chat.publishCreate({
			id : req.param('chatterId'),
			chatterId : req.param('chatterId'),
			message : req.param('message')
		});
	}
};
