/**
 * BoardController
 *
 * @description :: Server-side logic for managing Boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	res.view();
    },
    
    createBoard : function(req, res) {
	var title = req.param('title');
	console.log("create board:["+title+"]");
	title = title.trim();
	if(!title || title.length == 0){
	  console.log("トリム後のタイトルが空のため処理を中断");
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
	console.log("update board:"+req.param('id'));
	Board.update(req.param('id'), {
	    title:req.param('title'), 
	    description : req.param('description')
	}).exec(function(err,created){
	    res.redirect("/dashboard/index");
	});
    },
  
  register : function(req, res) {
    var boardId = req.param('boardId');
    console.log("リスナ登録:["+boardId+"]");
    var socket = req.socket;
    var io = sails.io;
    
    // リスナ登録
    socket.join('room_'+boardId+'_');
  },
  
  // チケットの作成、削除、更新処理アクション
  process : function(req, res) {
    var socket = req.socket;
    var io = sails.io;
    var actionType = req.param('actionType');
    var id = req.param('id');
    var boardId = req.param('boardId');
    var roomName = "room_"+boardId+"_";
    console.log("roomName["+roomName+"]");
    console.log("チケット処理：id=" + id + ",actionType=" + actionType);
    if (actionType == "create") {
      console.log("チケット作成");
      var userId = req.param('userId');
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
		    return console.log(err);
		} else {
		    console.log("チケットを作成しました：", ticket);
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
      console.log("チケット削除:" + id);
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
        console.log("チケット更新:" + id + ", " + x+","+y+","+contents);
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

