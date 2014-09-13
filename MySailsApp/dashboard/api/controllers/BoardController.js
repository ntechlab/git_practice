/**
 * BoardController
 *
 * @description :: Server-side logic for managing Boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
    sails.log.debug("action: BoardController.index");
	res.view();
    },
    
    createBoard : function(req, res) {
	var title = req.param('title');
    sails.log.debug("action: BoardController.createBoard[" + title + "]");
	title = title.trim();
	if(!title || title.length == 0){
	  // TODO: エラー処理
	  sails.log.debug("トリム後のタイトルが空のため処理を中断");
	  res.redirect("/dashboard/index");
	}
	Board.create({
	    title: title, 
	    description : req.param('description')
	}).exec(function(err,created){
	    res.redirect("/dashboard/index");
	});
    },
    
    updateBoard : function(req, res) {
	    var boardId = req.param('id');
        sails.log.debug("action: BoardController.updateBoard[" + boardId + "]");
	Board.update(boardId, {
	    title:req.param('title'), 
	    description : req.param('description')
	}).exec(function(err,created){
	    res.redirect("/dashboard/index");
	});
    },
  
  register : function(req, res) {
    var boardId = req.param('boardId');
    sails.log.debug("action: BoardController.register[" + boardId + "]");
    var socket = req.socket;
    var io = sails.io;
    
    // リスナ登録
    sails.log.debug("リスナ登録:socket.join[" + socket + ":" + boardId+"]");
    socket.join('room_'+boardId+'_');
  },
  
  // チケットの作成、削除、更新処理アクション
  process : function(req, res) {
    sails.log.debug("action: BoardController.process");
    var socket = req.socket;
    var io = sails.io;
    var actionType = req.param('actionType');
    var id = req.param('id');
    var boardId = req.param('boardId');
    var roomName = "room_"+boardId+"_";
    sails.log.debug(socket + ":roomName["+roomName+"]");
    sails.log.debug("チケット処理：id=" + id + ",actionType=" + actionType);
    if (actionType == "create") {
      var userId = req.param('userId');
      sails.log.debug("チケット作成["+userId+"]");
      User.findOne(userId).exec(function(err, foundUser) {
	    Ticket.create({
		boardId : boardId,
		createUser : userId,
		contents : req.param('contents'),
		positionX : req.param('positionX'),
		positionY : req.param('positionY'),
		color : req.param('color')
	    }).exec(function(err, ticket) {
		if (err) {
			// TODO: エラー通知方法検討
		    return console.log(err);
		} else {
		    sails.log.debug("チケットを作成しました："+ JSON.stringify(ticket));
		    io.sockets.in(roomName).emit('message',
		    {
		    action: "created",
			id: ticket.id, 
			contents: ticket.contents,
			boardId: ticket.boardId,
			createUser : ticket.createUser,
			positionX: ticket.positionX,
			positionY: ticket.positionY,
			color: ticket.color,
			nickname : foundUser["nickname"]});
		}
	    });
	});
    } else if (actionType == "destroy") {
      sails.log.debug("チケット削除:" + id);
      Ticket.findOne({
        id : id
      }).exec(function(err, found) {
        Ticket.destroy({id: id}).exec(function destroy(err2){
          if(found){
            io.sockets.in(roomName).emit('message',{action: "destroyed", id : found.id});
          }
        });
      });
    } else if (actionType == "update") {
        var x = req.param('positionX');
        var y = req.param('positionY');
        var contents = req.param('contents');
        sails.log.debug("チケット更新:" + id + ", " + x+","+y+","+contents);
        Ticket.update({
          id : id
        }, {
          positionX : x,
          positionY : y,
          contents : contents
      }).exec(function update(err, updated) {
         if(updated && updated[0]){
           io.sockets.in(roomName).emit('message',
             {
               action : "updated",
               id : updated[0].id,
               positionX: updated[0].positionX,
               positionY: updated[0].positionY,
               contents: updated[0].contents });
         }
      });
    } else if (actionType == "move") {
      var dstBoardId = req.param('dstBoardId');
      var ticketId = req.param('id');
      var nickname = req.param('nickname');
      sails.log.debug("チケット移動:["+ticketId + "][" + dashBoardId + "][" + nickname + "]");
      Ticket.update({
        id: id
      }, {
        boardId : dstBoardId
      }).exec(function update(err, updated){
        if(updated && updated[0]){
           var ticket = updated[0];
           io.sockets.in(roomName).emit('message',{action: "destroyed", id : id});
           io.sockets.in("room_" + dstBoardId).emit('message',
		    {
			    action: "created",
				id: id, 
				contents: ticket.contents,
				boardId: ticket.boardId,
				createUser : ticket.createUser,
				positionX: ticket.positionX,
				positionY: ticket.positionY,
				color: ticket.color,
				nickname : nickname
			});
		}
      })    
    }
  }

};

